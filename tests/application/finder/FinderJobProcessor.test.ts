import { FinderJobProcessor, SEVEN_DAYS_SECONDS } from '@application/finder/FinderJobProcessor.js';
import { SourceRegistry } from '@application/finder/SourceRegistry.js';
import type { ISourceExecutor } from '@application/queries/ports/ISourceExecutor.js';
import type { FinderJobRepository } from '@infrastructure/database/FinderJobRepository.js';
import type { JobRow } from '@infrastructure/database/JobRepository.js';
import { left, right } from '@shared/domain/Either.js';
import { JobEventType, JobStatus } from '@shared/domain/enums/queue.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';

function job(payload: Record<string, unknown>): JobRow {
  return {
    id: 7,
    job_id: '00000000-0000-0000-0000-000000000007',
    queue: 'full',
    priority: 5,
    status: 'claimed',
    tenant_slug: 'acme',
    query_type: 'finder',
    identifier: 'only-a-hash',
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
  };
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

const payload = {
  protocol_version: 2,
  operation: 'full_query',
  identifier: { kind: 'cnpj', value: '11222333000181' },
  source_selection: { sources: ['escavador'] },
};

describe('FinderJobProcessor', () => {
  it('writes ordered PostgreSQL events and returns redacted terminal result', async () => {
    const source: ISourceExecutor = {
      sourceName: 'escavador',
      execute: jest.fn().mockResolvedValue(
        right({
          source: 'escavador',
          data: { nome: 'Acme Ltda' },
          cost: 7,
          latency_ms: 10,
        }),
      ),
    };
    const repo = persistence();
    const processor = new FinderJobProcessor(
      new SourceRegistry([{ id: 'escavador', stage: 1, executor: source }], {}),
      repo,
    );

    const outcome = await processor.process(job(payload), new AbortController().signal);

    expect(repo.appendEvent.mock.calls.map((call) => call[1])).toEqual([
      JobEventType.PROGRESS,
      JobEventType.SOURCE_COMPLETED,
    ]);
    expect(repo.saveArtifact).toHaveBeenCalledWith(
      expect.objectContaining({
        jobId: '00000000-0000-0000-0000-000000000007',
        key: 'subject.name',
        provenance: expect.objectContaining({ sourceId: 'escavador' }),
      }),
    );
    expect(outcome.costActual).toBe(7);
    expect(outcome.result).toEqual(
      expect.objectContaining({ protocol_version: 2, status: 'completed' }),
    );
    expect(JSON.stringify(outcome.result)).not.toContain('cost');
  });

  it('reuses a cache hit without calling the provider or charging cost', async () => {
    const execute = jest.fn();
    const source: ISourceExecutor = { sourceName: 'escavador', execute };
    const repo = persistence();
    repo.lookupCache.mockResolvedValue({ data: { nome: 'Acme Ltda' }, cost: 7 });
    const processor = new FinderJobProcessor(
      new SourceRegistry([{ id: 'escavador', stage: 1, executor: source }], {}),
      repo,
    );

    const outcome = await processor.process(job(payload), new AbortController().signal);

    expect(execute).not.toHaveBeenCalled();
    expect(repo.saveRawResult).not.toHaveBeenCalled();
    expect(repo.saveCache).not.toHaveBeenCalled();
    expect(repo.completeSourceExecution).toHaveBeenCalledWith(
      11,
      expect.objectContaining({ cacheHit: true }),
    );
    expect(repo.appendEvent).toHaveBeenLastCalledWith(
      '00000000-0000-0000-0000-000000000007',
      JobEventType.SOURCE_COMPLETED,
      expect.objectContaining({ cache_hit: true }),
    );
    expect(outcome.costActual).toBe(0);
    expect(outcome.status).toBe(JobStatus.COMPLETED);
  });

  it('persists raw result and cache entry on a cache miss', async () => {
    const source: ISourceExecutor = {
      sourceName: 'escavador',
      execute: jest
        .fn()
        .mockResolvedValue(
          right({ source: 'escavador', data: { nome: 'Acme Ltda' }, cost: 7, latency_ms: 10 }),
        ),
    };
    const repo = persistence();
    const processor = new FinderJobProcessor(
      new SourceRegistry([{ id: 'escavador', stage: 1, executor: source }], {}),
      repo,
    );

    const outcome = await processor.process(job(payload), new AbortController().signal);

    expect(repo.saveRawResult).toHaveBeenCalledWith(
      expect.objectContaining({ gateway: 'escavador', tipoParam: 'cnpj', status: 'ok' }),
    );
    expect(repo.saveCache).toHaveBeenCalledWith(
      expect.any(String),
      { data: { nome: 'Acme Ltda' }, cost: 7 },
      SEVEN_DAYS_SECONDS,
    );
    expect(repo.completeSourceExecution).toHaveBeenCalledWith(
      11,
      expect.objectContaining({ cacheHit: false, rawResultId: 101 }),
    );
    expect(outcome.costActual).toBe(7);
  });

  it('requires bounded candidate selection before DataJud expansion', async () => {
    const escavador: ISourceExecutor = {
      sourceName: 'escavador',
      execute: jest.fn().mockResolvedValue(
        right({
          source: 'escavador',
          data: {
            processos: [
              { numero_cnj: '1004634-81.2023.8.26.0045' },
              { numero_cnj: '0931245-20.2025.8.12.0001' },
            ],
          },
          cost: 1,
          latency_ms: 10,
        }),
      ),
    };
    const datajud: ISourceExecutor = { sourceName: 'datajud', execute: jest.fn() };
    const repo = persistence();
    const processor = new FinderJobProcessor(
      new SourceRegistry(
        [
          { id: 'escavador', stage: 1, executor: escavador },
          {
            id: 'datajud',
            stage: 2,
            dependsOn: ['escavador'],
            requiresCandidate: true,
            executor: datajud,
          },
        ],
        {},
      ),
      repo,
      { candidateFanoutLimit: 1 },
    );

    const outcome = await processor.process(
      job({ ...payload, source_selection: { sources: ['datajud'] } }),
      new AbortController().signal,
    );

    expect(datajud.execute).not.toHaveBeenCalled();
    expect(repo.appendEvent.mock.calls.map((call) => call[1])).toEqual([
      JobEventType.PROGRESS,
      JobEventType.SOURCE_COMPLETED,
      JobEventType.CANDIDATE_SELECTION_REQUIRED,
    ]);
    expect(outcome.status).toBe(JobStatus.PARTIAL);
    expect(outcome.result).toEqual(
      expect.objectContaining({
        selection_required: {
          max_selectable: 1,
          candidates: [
            { id: '10046348120238260045', cnj: '1004634-81.2023.8.26.0045', tribunal: 'tjsp' },
          ],
        },
      }),
    );
  });

  it('rejects clear CPF in protocol version 2 payloads', async () => {
    const processor = new FinderJobProcessor(new SourceRegistry([], {}), persistence());

    await expect(
      processor.process(
        job({
          protocol_version: 2,
          operation: 'full_query',
          identifier: {
            kind: 'cpf',
            ciphertext: 'opaque',
            key_id: 'cpf-key',
            value: '12345678901',
          },
          source_selection: { sources: ['escavador'] },
        }),
        new AbortController().signal,
      ),
    ).rejects.toThrow('invalid_protocol_v2');
  });

  it('persists a redacted source failure without returning protected CPF ciphertext', async () => {
    const cipher = 'opaque-ciphertext-never-in-result';
    const source: ISourceExecutor = {
      sourceName: 'escavador',
      execute: jest.fn().mockResolvedValue(left(new SourceError('TIMEOUT', 'escavador'))),
    };
    const repo = persistence();
    const processor = new FinderJobProcessor(
      new SourceRegistry([{ id: 'escavador', stage: 1, executor: source }], {}),
      repo,
    );

    const outcome = await processor.process(
      job({
        protocol_version: 2,
        operation: 'full_query',
        identifier: { kind: 'cpf', ciphertext: cipher, key_id: 'cpf-key' },
        source_selection: { sources: ['escavador'] },
      }),
      new AbortController().signal,
    );

    expect(repo.appendEvent).toHaveBeenCalledWith(
      '00000000-0000-0000-0000-000000000007',
      JobEventType.SOURCE_FAILED,
      expect.objectContaining({ error_kind: 'CPF_IDENTIFIER_UNAVAILABLE' }),
    );
    expect(JSON.stringify(outcome.result)).not.toContain(cipher);
    expect(JSON.stringify(outcome.result)).not.toContain('12345678901');
  });

  it('emits source_failed for executor failures without provider error messages', async () => {
    const source: ISourceExecutor = {
      sourceName: 'escavador',
      execute: jest
        .fn()
        .mockResolvedValue(left(new SourceError('TIMEOUT', 'escavador', 'provider detail'))),
    };
    const repo = persistence();
    const processor = new FinderJobProcessor(
      new SourceRegistry([{ id: 'escavador', stage: 1, executor: source }], {}),
      repo,
    );

    await processor.process(job(payload), new AbortController().signal);

    expect(repo.appendEvent).toHaveBeenLastCalledWith(
      '00000000-0000-0000-0000-000000000007',
      JobEventType.SOURCE_FAILED,
      { source: 'escavador', stage: 1, error_kind: 'TIMEOUT' },
    );
  });
});
