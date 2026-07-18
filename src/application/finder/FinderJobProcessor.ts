import type { JobProcessResult, JobProcessor } from '@application/jobs/JobWorker.js';
import type { SourceContext } from '@application/queries/ports/ISourceExecutor.js';
import type { FinderJobRepository } from '@infrastructure/database/FinderJobRepository.js';
import type { JobRow } from '@infrastructure/database/JobRepository.js';
import { isLeft } from '@shared/domain/Either.js';
import { JobEventType, JobStatus, SourceExecutionStatus } from '@shared/domain/enums/queue.js';
import { deriveCacheKey } from '@shared/domain/privacy/cacheKey.js';
import type { RegisteredSource, SourceRegistry } from './SourceRegistry.js';
import type {
  ExecutionPlan,
  FinderArtifact,
  FinderJobPayload,
  ProcessCandidate,
} from './contracts.js';
import { parseFinderJobPayload } from './contracts.js';
import { deriveEscavadorArtifacts } from './derived.js';
import { type StepOutcome, computeCoverage } from './executionPlan.js';

export interface CpfIdentifierResolver {
  resolve(ciphertext: string, keyId: string): Promise<string>;
}

export interface SubjectProfileResolver {
  resolveProfile(ciphertext: string, keyId: string): Promise<Record<string, string>>;
}

/** Circuit breaker por provider — protege a margem: circuito aberto NÃO chama o provider. */
export interface CircuitBreakerPort {
  isOpen(): Promise<boolean>;
  recordSuccess(): Promise<void>;
  recordFailure(): Promise<void>;
}

export interface FinderJobProcessorOptions {
  candidateFanoutLimit?: number;
  sourceTimeoutMs?: number;
  cpfIdentifierResolver?: CpfIdentifierResolver;
  subjectProfileResolver?: SubjectProfileResolver;
  /** Fábrica de breaker por slug de provider. Ausente = sem circuit breaker (ex.: testes unitários). */
  circuitBreakerFor?: (providerSlug: string) => CircuitBreakerPort;
}

interface SourceBlock {
  source: string;
  stage: number;
  status: 'completed' | 'failed' | 'skipped';
}

const DEFAULT_CANDIDATE_FANOUT_LIMIT = 10;
const DEFAULT_SOURCE_TIMEOUT_MS = 30_000;
/** Teto de TTL do cache compartilhado: 7 dias (02-FINDER / 00-FOUNDATION). */
export const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

export class FinderJobProcessor {
  private readonly candidateFanoutLimit: number;
  private readonly sourceTimeoutMs: number;

  constructor(
    private readonly registry: SourceRegistry,
    private readonly repository: FinderJobRepository,
    private readonly options: FinderJobProcessorOptions = {},
  ) {
    this.candidateFanoutLimit = options.candidateFanoutLimit ?? DEFAULT_CANDIDATE_FANOUT_LIMIT;
    this.sourceTimeoutMs = options.sourceTimeoutMs ?? DEFAULT_SOURCE_TIMEOUT_MS;
    if (!Number.isInteger(this.candidateFanoutLimit) || this.candidateFanoutLimit < 1) {
      throw new RangeError('candidateFanoutLimit must be a positive integer');
    }
  }

  readonly process: JobProcessor = async (job, signal) => this.execute(job, signal);

  private async execute(job: JobRow, signal: AbortSignal): Promise<JobProcessResult> {
    const startedAt = Date.now();
    const payload = parseFinderJobPayload(this.payloadObject(job));
    const plan = this.registry.plan(payload.source_selection);
    // Perfil do investigado, decifrado UMA vez por job e compartilhado entre as fontes.
    const subjectProfile = await this.resolveSubjectProfile(payload);
    const blocks: SourceBlock[] = [];
    const artifacts: FinderArtifact[] = [];
    let costActual = 0;
    let requiresSelection = false;

    // Plano CONGELADO por produto (B4.5): grupo de fallback por fonte canônica + rastreio de
    // desfechos para cobertura. `satisfiedGroups` habilita o skip best-effort (não re-chama um
    // grupo já coberto). Ausente = fluxo legado por-fonte, sem cobertura.
    const executionPlan = payload.execution_plan;
    const groupBySource = this.canonicalGroups(executionPlan);
    // RB-08: origem real por fonte (do plano congelado). O breaker correlaciona por origem —
    // Receita fora do ar abre UM circuito para todos os proxies dela.
    const originBySource = new Map<string, string>();
    for (const step of executionPlan?.steps ?? []) {
      if (step.origin != null) originBySource.set(step.source_code, step.origin);
    }
    const satisfiedGroups = new Set<string>();
    const outcomes = new Map<string, StepOutcome>();
    // Dentro de um mesmo stage, executa na ordem CONGELADA do plano (primário antes do fallback),
    // preservando a ordem por stage entre dependências. Sem plano, mantém a ordem do registry.
    const orderedPlan = this.applyFrozenOrder(plan, executionPlan);

    for (const source of orderedPlan) {
      this.assertNotAborted(signal);
      if (source.requiresCandidate) {
        const candidates = this.readCandidates(artifacts);
        const selected = this.selectedCandidates(payload, candidates);
        if (selected === null) {
          requiresSelection = true;
          await this.repository.appendEvent(job.job_id, JobEventType.CANDIDATE_SELECTION_REQUIRED, {
            source: source.id,
            max_selectable: this.candidateFanoutLimit,
            candidate_ids: candidates.map((candidate) => candidate.id),
          });
          break;
        }
        for (const candidate of selected) {
          const result = await this.executeSource(
            job,
            source,
            { identifier: candidate.cnj, identifierKind: 'PROCESSO' },
            candidate.id,
            signal,
            subjectProfile,
            originBySource.get(source.id),
          );
          blocks.push(result.block);
          costActual += result.cost;
        }
        continue;
      }

      // Skip de fallback (B4.5): se este grupo já foi coberto por um membro anterior, não re-chama
      // o provider — economiza COGS sem alterar a cobertura (o grupo já está satisfeito).
      const group = groupBySource.get(source.id) ?? null;
      if (group !== null && satisfiedGroups.has(group)) {
        outcomes.set(source.id, 'skipped');
        blocks.push({ source: source.id, stage: source.stage, status: 'skipped' });
        continue;
      }

      const identifier = await this.resolveIdentifier(payload);
      if (identifier === null) {
        const executionId = await this.repository.startSourceExecution({
          jobId: job.job_id,
          sourceId: source.id,
          stage: source.stage,
        });
        await this.repository.failSourceExecution(executionId, 'CPF_IDENTIFIER_UNAVAILABLE');
        await this.repository.appendEvent(job.job_id, JobEventType.SOURCE_FAILED, {
          source: source.id,
          stage: source.stage,
          error_kind: 'CPF_IDENTIFIER_UNAVAILABLE',
        });
        outcomes.set(source.id, 'failed');
        blocks.push({ source: source.id, stage: source.stage, status: 'failed' });
        continue;
      }

      const result = await this.executeSource(
        job,
        source,
        identifier,
        undefined,
        signal,
        subjectProfile,
        originBySource.get(source.id),
      );
      blocks.push(result.block);
      costActual += result.cost;
      if (result.artifacts.length > 0) artifacts.push(...result.artifacts);
      outcomes.set(source.id, result.block.status);
      if (result.block.status === 'completed' && group !== null) satisfiedGroups.add(group);
    }

    // Duas representações do MESMO estado, de propósito:
    //  - `statusLabel` vai no JSON de `jobs.result` — payload é validado por schema nos dois
    //    lados e é o que um humano lê ao depurar um job;
    //  - `status` vai na COLUNA `jobs.status`, que é numérica (contrato da fila, ADR-0024).
    const partial = requiresSelection || blocks.some((block) => block.status === 'failed');
    const statusLabel = partial ? 'partial' : 'completed';
    const status = partial ? JobStatus.PARTIAL : JobStatus.COMPLETED;

    const summary: Record<string, unknown> = {
      completed_sources: blocks.filter((block) => block.status === 'completed').length,
      failed_sources: blocks.filter((block) => block.status === 'failed').length,
    };
    // Cobertura por REQUISITO (B4.5): alimenta a máquina de consumo do Laravel (B4.3). Só existe
    // quando o job trouxe plano congelado (investigação por produto).
    if (executionPlan !== undefined) {
      const normalized = this.normalizePlan(executionPlan);
      const coverage = computeCoverage(normalized, outcomes);
      // RB-14: quantos grupos de fallback foram satisfeitos SEM a primária (degradação suave —
      // a primária falhou/vazou e o fallback segurou). Alimenta o alerta do Laravel.
      let fallbackHits = 0;
      const byGroup = new Map<string, { source_code: string; order: number }[]>();
      for (const step of normalized.steps) {
        if (step.fallback_group === null) continue;
        const members = byGroup.get(step.fallback_group) ?? [];
        members.push({ source_code: step.source_code, order: step.order });
        byGroup.set(step.fallback_group, members);
      }
      for (const members of byGroup.values()) {
        members.sort((a, b) => a.order - b.order);
        const primary = members[0];
        if (primary === undefined) continue;
        const satisfied = members.some((m) => outcomes.get(m.source_code) === 'completed');
        if (satisfied && outcomes.get(primary.source_code) !== 'completed') fallbackHits += 1;
      }
      summary['coverage'] = {
        required_total: coverage.requiredTotal,
        required_succeeded: coverage.requiredSucceeded,
        optional_total: coverage.optionalTotal,
        optional_succeeded: coverage.optionalSucceeded,
        fallback_hits: fallbackHits,
        // Heurística conservadora: houve dado quando ao menos uma fonte completou. A distinção
        // fina "completou porém vazio" (ausência válida) é refinada no Laravel por bloco.
        records_found: blocks.some((block) => block.status === 'completed'),
      };
    }

    // Contrato terminal com o consumidor Laravel (drift pego pelo E2E cross-process, P14):
    // o consume-terminal EXIGE cost_actual (espelho do contador da coluna), `full` (dados
    // allowlisted projetados em result_full) e `failed_blocks` (lista de fontes falhas).
    const safeResult: Record<string, unknown> = {
      protocol_version: 2,
      status: statusLabel,
      cost_actual: costActual,
      duration_ms: Date.now() - startedAt,
      blocks,
      summary,
      // Derivados allowlisted por chave de artefato — nunca payload bruto de provider.
      full: Object.fromEntries(artifacts.map((artifact) => [artifact.key, artifact.value])),
      failed_blocks: blocks
        .filter((block) => block.status === 'failed')
        .map((block) => block.source),
      artifacts,
    };
    if (requiresSelection) {
      safeResult['selection_required'] = {
        max_selectable: this.candidateFanoutLimit,
        candidates: this.readCandidates(artifacts),
      };
    }
    return { result: safeResult, costActual, status };
  }

  /**
   * Índice fonte-canônica → grupo de fallback, a partir do plano congelado. Os passos falam em
   * códigos do catálogo Laravel (`directdata_qsa`); aqui resolvemos para o id canônico do registry
   * (`directdata`) para casar com as fontes efetivamente executadas.
   */
  private canonicalGroups(plan: ExecutionPlan | undefined): ReadonlyMap<string, string | null> {
    if (plan === undefined) return new Map();
    const groups = new Map<string, string | null>();
    for (const step of plan.steps) {
      const canonical = this.registry.resolveCanonicalId(step.source_code);
      if (canonical !== undefined) groups.set(canonical, step.fallback_group);
    }
    return groups;
  }

  /**
   * Ordena as fontes por stage (preserva dependências) e, DENTRO do stage, pela ordem congelada do
   * plano — o primário (order menor) roda antes do fallback, habilitando o skip. Fontes fora do
   * plano (dependências injetadas) mantêm precedência por stage.
   */
  private applyFrozenOrder(
    plan: readonly RegisteredSource[],
    executionPlan: ExecutionPlan | undefined,
  ): RegisteredSource[] {
    if (executionPlan === undefined) return [...plan];
    const orderByCanonical = new Map<string, number>();
    for (const step of executionPlan.steps) {
      const canonical = this.registry.resolveCanonicalId(step.source_code);
      if (canonical !== undefined && !orderByCanonical.has(canonical)) {
        orderByCanonical.set(canonical, step.order);
      }
    }
    return [...plan].sort(
      (left, right) =>
        left.stage - right.stage ||
        (orderByCanonical.get(left.id) ?? Number.POSITIVE_INFINITY) -
          (orderByCanonical.get(right.id) ?? Number.POSITIVE_INFINITY) ||
        left.id.localeCompare(right.id),
    );
  }

  /** Reescreve os `source_code` dos passos para o id canônico, para a contagem de cobertura. */
  private normalizePlan(plan: ExecutionPlan): ExecutionPlan {
    return {
      product_code: plan.product_code,
      steps: plan.steps.map((step) => ({
        ...step,
        source_code: this.registry.resolveCanonicalId(step.source_code) ?? step.source_code,
      })),
    };
  }

  private payloadObject(job: JobRow): unknown {
    if (typeof job.payload !== 'string') return job.payload;
    try {
      return JSON.parse(job.payload) as unknown;
    } catch {
      throw new Error('invalid_protocol_v2');
    }
  }

  private async resolveIdentifier(
    payload: FinderJobPayload,
  ): Promise<Pick<SourceContext, 'identifier' | 'identifierKind'> | null> {
    if (payload.identifier.kind === 'cnpj') {
      return { identifier: payload.identifier.value, identifierKind: 'CNPJ' };
    }
    if (this.options.cpfIdentifierResolver === undefined) return null;
    let identifier: string;
    try {
      identifier = await this.options.cpfIdentifierResolver.resolve(
        payload.identifier.ciphertext,
        payload.identifier.key_id,
      );
    } catch {
      throw new Error('cpf_identifier_unavailable');
    }
    if (identifier.length === 0) throw new Error('cpf_identifier_unavailable');
    return { identifier, identifierKind: 'CPF' };
  }

  /**
   * Decifra o perfil do investigado uma vez por job. Ausente no payload, devolve undefined
   * (job sem perfil). Presente mas sem resolver disponível é erro de configuração — falha alto
   * em vez de rodar sem o dado que a fonte exige.
   */
  private async resolveSubjectProfile(
    payload: FinderJobPayload,
  ): Promise<Record<string, string> | undefined> {
    if (payload.subject_profile === undefined) return undefined;
    if (this.options.subjectProfileResolver === undefined) {
      throw new Error('subject_profile_resolver_unavailable');
    }
    return this.options.subjectProfileResolver.resolveProfile(
      payload.subject_profile.ciphertext,
      payload.subject_profile.key_id,
    );
  }

  private async executeSource(
    job: JobRow,
    source: RegisteredSource,
    identifier: Pick<SourceContext, 'identifier' | 'identifierKind'>,
    candidateId: string | undefined,
    signal: AbortSignal,
    subjectProfile?: Record<string, string>,
    breakerOrigin?: string,
  ): Promise<{ block: SourceBlock; cost: number; artifacts: FinderArtifact[] }> {
    this.assertNotAborted(signal);
    const cacheKey = deriveCacheKey(source.id, identifier.identifierKind, identifier.identifier);
    await this.repository.appendEvent(job.job_id, JobEventType.PROGRESS, {
      source: source.id,
      stage: source.stage,
      state: 'started',
    });
    const executionId = await this.repository.startSourceExecution({
      jobId: job.job_id,
      sourceId: source.id,
      sourceCode: source.id,
      stage: source.stage,
      ...(candidateId === undefined ? {} : { candidateId }),
    });

    // Cache compartilhado: hit dentro do TTL reutiliza sem chamar provider nem cobrar.
    const cached = await this.repository.lookupCache(cacheKey);
    if (cached !== null) {
      await this.repository.completeSourceExecution(executionId, { cacheHit: true, cacheKey, costCents: 0 });
      await this.repository.appendEvent(job.job_id, JobEventType.SOURCE_COMPLETED, {
        source: source.id,
        stage: source.stage,
        cache_hit: true,
      });
      const artifacts = this.deriveArtifacts(source, cached.data, executionId);
      await this.persistArtifacts(job.job_id, artifacts);
      return {
        block: { source: source.id, stage: source.stage, status: 'completed' },
        cost: 0,
        artifacts,
      };
    }

    // Circuit breaker: com o circuito ABERTO, o provider degradado NÃO é chamado — falha
    // rápido, sem queimar COGS. O cache-hit acima já foi servido (não depende do provider).
    // RB-08: circuito por ORIGEM quando conhecida (mata falsa diversidade de revendedores);
    // sem origem homologada, cai no comportamento por provider.
    const breaker = this.options.circuitBreakerFor?.(breakerOrigin ?? source.executor.sourceName);
    if (breaker !== undefined && (await breaker.isOpen())) {
      await this.repository.failSourceExecution(executionId, 'CIRCUIT_OPEN');
      await this.repository.appendEvent(job.job_id, JobEventType.SOURCE_FAILED, {
        source: source.id,
        stage: source.stage,
        error_kind: 'CIRCUIT_OPEN',
      });
      return {
        block: { source: source.id, stage: source.stage, status: 'failed' },
        cost: 0,
        artifacts: [],
      };
    }

    let outcome: Awaited<ReturnType<typeof source.executor.execute>>;
    try {
      outcome = await source.executor.execute({
        ...identifier,
        tenantSlug: job.tenant_slug,
        correlationId: job.correlation_id,
        timeoutMs: this.sourceTimeoutMs,
        ...(subjectProfile === undefined ? {} : { subjectProfile }),
      });
    } catch {
      await breaker?.recordFailure();
      await this.repository.failSourceExecution(executionId, 'UPSTREAM_ERROR');
      await this.repository.appendEvent(job.job_id, JobEventType.SOURCE_FAILED, {
        source: source.id,
        stage: source.stage,
        error_kind: 'UPSTREAM_ERROR',
      });
      return {
        block: { source: source.id, stage: source.stage, status: 'failed' },
        cost: 0,
        artifacts: [],
      };
    }
    this.assertNotAborted(signal);
    if (isLeft(outcome)) {
      await breaker?.recordFailure();
      await this.repository.failSourceExecution(executionId, outcome.value.kind);
      await this.repository.appendEvent(job.job_id, JobEventType.SOURCE_FAILED, {
        source: source.id,
        stage: source.stage,
        error_kind: outcome.value.kind,
      });
      return {
        block: { source: source.id, stage: source.stage, status: 'failed' },
        cost: 0,
        artifacts: [],
      };
    }

    // Provider respondeu com sucesso — fecha o circuito se estava em sondagem (half_open).
    await breaker?.recordSuccess();

    // Miss: persiste resultado bruto (auditoria) + entrada de cache com TTL <= 7 dias,
    // ligados pela chave opaca. CPF e hasheado dentro do repositorio (LGPD).
    const rawResultId = await this.repository.saveRawResult({
      gateway: source.id,
      fonte: source.id,
      tipoParam: this.deriveTipoParam(identifier.identifierKind),
      param: identifier.identifier,
      result: outcome.value.data,
      status: SourceExecutionStatus.COMPLETED,
      correlationId: job.correlation_id,
      cacheKey,
    });
    const ttlSeconds = Math.min(source.cacheTtlSeconds ?? SEVEN_DAYS_SECONDS, SEVEN_DAYS_SECONDS);
    await this.repository.saveCache(
      cacheKey,
      { data: outcome.value.data, cost: outcome.value.cost },
      ttlSeconds,
    );

    await this.repository.completeSourceExecution(executionId, {
      cacheHit: false,
      cacheKey,
      rawResultId,
      // RB-03: custo REAL medido (ex.: X-Request-Cost da Fonte Data). Ausente = o Laravel
      // precifica pelo catálogo no consume-terminal.
      ...(outcome.value.costCents === undefined ? {} : { costCents: outcome.value.costCents }),
    });
    await this.repository.appendEvent(job.job_id, JobEventType.SOURCE_COMPLETED, {
      source: source.id,
      stage: source.stage,
    });
    const artifacts = this.deriveArtifacts(source, outcome.value.data, executionId);
    await this.persistArtifacts(job.job_id, artifacts);
    return {
      block: { source: source.id, stage: source.stage, status: 'completed' },
      cost: outcome.value.cost,
      artifacts,
    };
  }

  private deriveArtifacts(
    source: RegisteredSource,
    data: Record<string, unknown>,
    executionId: number,
  ): FinderArtifact[] {
    return source.id === 'escavador'
      ? deriveEscavadorArtifacts(data, executionId, this.candidateFanoutLimit)
      : [];
  }

  private async persistArtifacts(
    jobId: string,
    artifacts: readonly FinderArtifact[],
  ): Promise<void> {
    await Promise.all(
      artifacts.map((artifact) => this.repository.saveArtifact({ ...artifact, jobId })),
    );
  }

  private deriveTipoParam(kind: SourceContext['identifierKind']): string {
    if (kind === 'CPF') return 'cpf';
    if (kind === 'CNPJ') return 'cnpj';
    return 'numero_cnj';
  }

  private readCandidates(artifacts: readonly FinderArtifact[]): ProcessCandidate[] {
    const artifact = artifacts.find((item) => item.key === 'process.candidates');
    const candidates = artifact?.value['candidates'];
    if (!Array.isArray(candidates)) return [];
    return candidates.filter(
      (candidate): candidate is ProcessCandidate =>
        typeof candidate === 'object' &&
        candidate !== null &&
        typeof (candidate as Record<string, unknown>)['id'] === 'string' &&
        typeof (candidate as Record<string, unknown>)['cnj'] === 'string' &&
        typeof (candidate as Record<string, unknown>)['tribunal'] === 'string',
    );
  }

  private selectedCandidates(
    payload: FinderJobPayload,
    candidates: readonly ProcessCandidate[],
  ): ProcessCandidate[] | null {
    const selectedIds = payload.selected_candidate_ids;
    if (selectedIds === undefined || selectedIds.length === 0) return null;
    if (selectedIds.length > this.candidateFanoutLimit)
      throw new Error('invalid_candidate_selection');
    if (new Set(selectedIds).size !== selectedIds.length) {
      throw new Error('invalid_candidate_selection');
    }
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
    const selected = selectedIds.map((id) => byId.get(id));
    if (selected.some((candidate) => candidate === undefined)) {
      throw new Error('invalid_candidate_selection');
    }
    return selected as ProcessCandidate[];
  }

  private assertNotAborted(signal: AbortSignal): void {
    if (signal.aborted) throw new Error('processor_aborted');
  }
}
