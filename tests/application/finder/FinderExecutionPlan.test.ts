import { FinderJobProcessor } from '@application/finder/FinderJobProcessor.js';
import { SourceRegistry } from '@application/finder/SourceRegistry.js';
import type { ExecutionPlan } from '@application/finder/contracts.js';
import { type StepOutcome, computeCoverage } from '@application/finder/executionPlan.js';
import type { ISourceExecutor } from '@application/queries/ports/ISourceExecutor.js';
import type { FinderJobRepository } from '@infrastructure/database/FinderJobRepository.js';
import type { JobRow } from '@infrastructure/database/JobRepository.js';
import { left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';

/*
 * B4.5 — execução de produtos no motor. O plano CONGELADO (execution_plan) viaja no payload; o
 * worker executa etapas e fallbacks e devolve COBERTURA por requisito (alimenta a máquina de
 * consumo da B4.3 no Laravel). Um grupo de fallback é UM requisito satisfeito por qualquer membro.
 */

function job(payload: Record<string, unknown>): JobRow {
  return {
    id: 7,
    job_id: '00000000-0000-0000-0000-000000000007',
    queue: 'full',
    priority: 5,
    status: 'claimed',
    tenant_slug: 'acme',
    query_type: 'finder',
    identifier: '11222333000181',
    plan: 'finder',
    payload,
    result: null,
    cost_reserved: 10,
    cost_actual: null,
    attempts: 1,
    max_attempts: 2,
    available_at: new Date(),
    claimed_at: new Date(),
    claimed_by: 'test',
    claim_token: '00000000-0000-0000-0000-000000000001',
    lease_expires_at: new Date(Date.now() + 30_000),
    correlation_id: '00000000-0000-0000-0000-000000000002',
    requested_by: '00000000-0000-0000-0000-000000000003',
    created_at: new Date(),
    updated_at: new Date(),
  } as unknown as JobRow;
}

function persistence(): jest.Mocked<FinderJobRepository> {
  return {
    appendEvent: jest.fn(),
    startSourceExecution: jest.fn().mockResolvedValue(11),
    completeSourceExecution: jest.fn(),
    failSourceExecution: jest.fn(),
    saveArtifact: jest.fn(),
    lookupCache: jest.fn().mockResolvedValue(null),
    saveRawResult: jest.fn().mockResolvedValue(101),
    saveCache: jest.fn(),
  } as unknown as jest.Mocked<FinderJobRepository>;
}

function ok(name: string): ISourceExecutor {
  return {
    sourceName: name,
    execute: jest
      .fn()
      .mockResolvedValue(right({ source: name, data: { ok: true }, cost: 3, latency_ms: 1 })),
  };
}

function fail(name: string): ISourceExecutor {
  return {
    sourceName: name,
    execute: jest.fn().mockResolvedValue(left(new SourceError('UPSTREAM_ERROR', 'boom'))),
  };
}

const basePayload = {
  protocol_version: 2,
  operation: 'full_query',
  identifier: { kind: 'cnpj', value: '11222333000181' },
} as const;

function planWith(steps: ExecutionPlan['steps']): ExecutionPlan {
  return { product_code: 'C1', steps };
}

describe('computeCoverage (B4.5)', () => {
  it('conta grupo de fallback como UM requisito satisfeito por qualquer membro', () => {
    const plan = planWith([
      { source_code: 'a', required: true, fallback_group: 'g', order: 1 },
      { source_code: 'b', required: false, fallback_group: 'g', order: 2 },
      { source_code: 'c', required: false, fallback_group: null, order: 3 },
    ]);
    const outcomes = new Map<string, StepOutcome>([
      ['a', 'failed'],
      ['b', 'completed'],
      ['c', 'completed'],
    ]);
    // g é essencial (a é required) e satisfeito por b → 1/1 essencial; c opcional satisfeito → 1/1.
    expect(computeCoverage(plan, outcomes)).toEqual({
      requiredTotal: 1,
      requiredSucceeded: 1,
      optionalTotal: 1,
      optionalSucceeded: 1,
    });
  });

  it('requisito essencial sem nenhum membro completo conta como não satisfeito', () => {
    const plan = planWith([
      { source_code: 'a', required: true, fallback_group: 'g', order: 1 },
      { source_code: 'b', required: false, fallback_group: 'g', order: 2 },
    ]);
    const outcomes = new Map<string, StepOutcome>([
      ['a', 'failed'],
      ['b', 'failed'],
    ]);
    expect(computeCoverage(plan, outcomes)).toEqual({
      requiredTotal: 1,
      requiredSucceeded: 0,
      optionalTotal: 0,
      optionalSucceeded: 0,
    });
  });
});

describe('FinderJobProcessor com plano congelado (B4.5)', () => {
  it('primeiro membro do grupo entrega → segundo é PULADO (economia de COGS) e cobertura é 1/1', async () => {
    const primary = ok('brasilapi_cnpj');
    const fallback = ok('apibrasil_cadastro_pj');
    const registry = new SourceRegistry(
      [
        { id: 'brasilapi_cnpj', stage: 1, executor: primary },
        { id: 'apibrasil_cadastro_pj', stage: 1, executor: fallback },
      ],
      {},
    );
    const processor = new FinderJobProcessor(registry, persistence());
    const execution_plan = planWith([
      { source_code: 'brasilapi_cnpj', required: true, fallback_group: 'cadastro_pj', order: 1 },
      {
        source_code: 'apibrasil_cadastro_pj',
        required: false,
        fallback_group: 'cadastro_pj',
        order: 2,
      },
    ]);

    const outcome = await processor.process(
      job({
        ...basePayload,
        source_selection: { sources: ['brasilapi_cnpj', 'apibrasil_cadastro_pj'] },
        execution_plan,
      }),
      new AbortController().signal,
    );

    // O fallback não foi chamado — o grupo já estava coberto.
    expect(fallback.execute).not.toHaveBeenCalled();
    const summary = (outcome.result as { summary: Record<string, unknown> }).summary;
    expect(summary['coverage']).toEqual({
      required_total: 1,
      required_succeeded: 1,
      optional_total: 0,
      optional_succeeded: 0,
      fallback_hits: 0,
      records_found: true,
    });
  });

  it('primeiro falha → fallback executa e cobre o grupo (cobertura 1/1, sem skip)', async () => {
    const primary = fail('datajud');
    const fallback = ok('directdata');
    // Registrado pelo id canônico com alias do catálogo Laravel — a cobertura resolve o alias.
    const registry = new SourceRegistry(
      [
        { id: 'datajud', aliases: ['datajud_processos'], stage: 1, executor: primary },
        { id: 'directdata', aliases: ['directdata_processos'], stage: 1, executor: fallback },
      ],
      {},
    );
    const processor = new FinderJobProcessor(registry, persistence());
    const execution_plan = planWith([
      { source_code: 'datajud_processos', required: true, fallback_group: 'judicial', order: 1 },
      {
        source_code: 'directdata_processos',
        required: false,
        fallback_group: 'judicial',
        order: 2,
      },
    ]);

    const outcome = await processor.process(
      job({
        ...basePayload,
        source_selection: { sources: ['datajud_processos', 'directdata_processos'] },
        execution_plan,
      }),
      new AbortController().signal,
    );

    expect(fallback.execute).toHaveBeenCalledTimes(1);
    const summary = (outcome.result as { summary: Record<string, unknown> }).summary;
    expect(summary['coverage']).toMatchObject({ required_total: 1, required_succeeded: 1 });
  });

  it('requisito essencial sem fallback que falha → cobertura essencial 0/1', async () => {
    const primary = fail('brasilapi_cnpj');
    const registry = new SourceRegistry(
      [{ id: 'brasilapi_cnpj', stage: 1, executor: primary }],
      {},
    );
    const processor = new FinderJobProcessor(registry, persistence());
    const execution_plan = planWith([
      { source_code: 'brasilapi_cnpj', required: true, fallback_group: null, order: 1 },
    ]);

    const outcome = await processor.process(
      job({ ...basePayload, source_selection: { sources: ['brasilapi_cnpj'] }, execution_plan }),
      new AbortController().signal,
    );

    const summary = (outcome.result as { summary: Record<string, unknown> }).summary;
    expect(summary['coverage']).toMatchObject({
      required_total: 1,
      required_succeeded: 0,
      records_found: false,
    });
  });

  it('sem execution_plan (fluxo legado) não emite cobertura', async () => {
    const registry = new SourceRegistry(
      [{ id: 'brasilapi_cnpj', stage: 1, executor: ok('brasilapi_cnpj') }],
      {},
    );
    const processor = new FinderJobProcessor(registry, persistence());

    const outcome = await processor.process(
      job({ ...basePayload, source_selection: { sources: ['brasilapi_cnpj'] } }),
      new AbortController().signal,
    );

    const summary = (outcome.result as { summary: Record<string, unknown> }).summary;
    expect(summary['coverage']).toBeUndefined();
  });
});

describe('computeCoverage ponderada (REGRAS §14)', () => {
  const plan = {
    product_code: 'P2',
    steps: [
      { source_code: 'primaria_pesada', required: true, fallback_group: null, order: 1, weight: 3 },
      { source_code: 'secundaria', required: true, fallback_group: null, order: 2, weight: 1 },
      { source_code: 'enriquecimento', required: false, fallback_group: null, order: 3, weight: 2 },
    ],
  };

  it('soma PESOS por requisito — primária pesada falhando derruba a cobertura além da contagem', () => {
    const outcomes = new Map<string, StepOutcome>([
      ['primaria_pesada', 'failed'],
      ['secundaria', 'completed'],
      ['enriquecimento', 'completed'],
    ]);

    const coverage = computeCoverage(plan, outcomes);

    // Contagem simples daria 1/2 = 0.5; ponderada dá 1/4 = 0.25.
    expect(coverage).toEqual({
      requiredTotal: 4,
      requiredSucceeded: 1,
      optionalTotal: 2,
      optionalSucceeded: 2,
    });
  });

  it('peso do requisito em grupo de fallback é o MAIOR entre os membros', () => {
    const grouped = {
      product_code: 'P2',
      steps: [
        { source_code: 'a', required: true, fallback_group: 'g', order: 1, weight: 3 },
        { source_code: 'b', required: false, fallback_group: 'g', order: 2, weight: 1 },
      ],
    };
    const coverage = computeCoverage(
      grouped,
      new Map<string, StepOutcome>([
        ['a', 'failed'],
        ['b', 'completed'],
      ]),
    );

    // O fallback barato satisfaz o MESMO requisito, valendo o peso cheio (3/3).
    expect(coverage).toEqual({
      requiredTotal: 3,
      requiredSucceeded: 3,
      optionalTotal: 0,
      optionalSucceeded: 0,
    });
  });

  it('sem pesos declarados degenera na contagem simples (compatibilidade)', () => {
    const unweighted = {
      product_code: 'P2',
      steps: [
        { source_code: 'a', required: true, fallback_group: null, order: 1 },
        { source_code: 'b', required: true, fallback_group: null, order: 2 },
      ],
    };
    const coverage = computeCoverage(
      unweighted,
      new Map<string, StepOutcome>([['a', 'completed']]),
    );

    expect(coverage).toEqual({
      requiredTotal: 2,
      requiredSucceeded: 1,
      optionalTotal: 0,
      optionalSucceeded: 0,
    });
  });
});
