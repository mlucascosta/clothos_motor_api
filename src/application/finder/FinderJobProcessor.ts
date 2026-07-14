import type { JobProcessResult, JobProcessor } from '@application/jobs/JobWorker.js';
import type { SourceContext } from '@application/queries/ports/ISourceExecutor.js';
import type { FinderJobRepository } from '@infrastructure/database/FinderJobRepository.js';
import type { JobRow } from '@infrastructure/database/JobRepository.js';
import { isLeft } from '@shared/domain/Either.js';
import { deriveCacheKey } from '@shared/domain/privacy/cacheKey.js';
import type { RegisteredSource, SourceRegistry } from './SourceRegistry.js';
import type { FinderArtifact, FinderJobPayload, ProcessCandidate } from './contracts.js';
import { parseFinderJobPayload } from './contracts.js';
import { deriveEscavadorArtifacts } from './derived.js';

export interface CpfIdentifierResolver {
  resolve(ciphertext: string, keyId: string): Promise<string>;
}

export interface FinderJobProcessorOptions {
  candidateFanoutLimit?: number;
  sourceTimeoutMs?: number;
  cpfIdentifierResolver?: CpfIdentifierResolver;
}

interface SourceBlock {
  source: string;
  stage: number;
  status: 'completed' | 'failed';
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
    const blocks: SourceBlock[] = [];
    const artifacts: FinderArtifact[] = [];
    let costActual = 0;
    let requiresSelection = false;

    for (const source of plan) {
      this.assertNotAborted(signal);
      if (source.requiresCandidate) {
        const candidates = this.readCandidates(artifacts);
        const selected = this.selectedCandidates(payload, candidates);
        if (selected === null) {
          requiresSelection = true;
          await this.repository.appendEvent(job.job_id, 'candidate_selection_required', {
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
          );
          blocks.push(result.block);
          costActual += result.cost;
        }
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
        await this.repository.appendEvent(job.job_id, 'source_failed', {
          source: source.id,
          stage: source.stage,
          error_kind: 'CPF_IDENTIFIER_UNAVAILABLE',
        });
        blocks.push({ source: source.id, stage: source.stage, status: 'failed' });
        continue;
      }

      const result = await this.executeSource(job, source, identifier, undefined, signal);
      blocks.push(result.block);
      costActual += result.cost;
      if (result.artifacts.length > 0) artifacts.push(...result.artifacts);
    }

    const status =
      requiresSelection || blocks.some((block) => block.status === 'failed')
        ? 'partial'
        : 'completed';
    const safeResult: Record<string, unknown> = {
      protocol_version: 2,
      status,
      duration_ms: Date.now() - startedAt,
      blocks,
      summary: {
        completed_sources: blocks.filter((block) => block.status === 'completed').length,
        failed_sources: blocks.filter((block) => block.status === 'failed').length,
      },
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

  private async executeSource(
    job: JobRow,
    source: RegisteredSource,
    identifier: Pick<SourceContext, 'identifier' | 'identifierKind'>,
    candidateId: string | undefined,
    signal: AbortSignal,
  ): Promise<{ block: SourceBlock; cost: number; artifacts: FinderArtifact[] }> {
    this.assertNotAborted(signal);
    const cacheKey = deriveCacheKey(source.id, identifier.identifierKind, identifier.identifier);
    await this.repository.appendEvent(job.job_id, 'progress', {
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
      await this.repository.completeSourceExecution(executionId, { cacheHit: true, cacheKey });
      await this.repository.appendEvent(job.job_id, 'source_completed', {
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

    let outcome: Awaited<ReturnType<typeof source.executor.execute>>;
    try {
      outcome = await source.executor.execute({
        ...identifier,
        tenantSlug: job.tenant_slug,
        correlationId: job.correlation_id,
        timeoutMs: this.sourceTimeoutMs,
      });
    } catch {
      await this.repository.failSourceExecution(executionId, 'UPSTREAM_ERROR');
      await this.repository.appendEvent(job.job_id, 'source_failed', {
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
      await this.repository.failSourceExecution(executionId, outcome.value.kind);
      await this.repository.appendEvent(job.job_id, 'source_failed', {
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

    // Miss: persiste resultado bruto (auditoria) + entrada de cache com TTL <= 7 dias,
    // ligados pela chave opaca. CPF e hasheado dentro do repositorio (LGPD).
    const rawResultId = await this.repository.saveRawResult({
      gateway: source.id,
      fonte: source.id,
      tipoParam: this.deriveTipoParam(identifier.identifierKind),
      param: identifier.identifier,
      result: outcome.value.data,
      status: 'ok',
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
    });
    await this.repository.appendEvent(job.job_id, 'source_completed', {
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
