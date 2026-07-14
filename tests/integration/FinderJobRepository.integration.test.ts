import { FinderJobRepository } from '@infrastructure/database/FinderJobRepository.js';
import {
  JobEventType,
  JobQueue,
  JobStatus,
  SourceExecutionStatus,
} from '@shared/domain/enums/queue.js';
import { Pool } from 'pg';
import { truncateTables } from './setup/truncate.js';

const DATABASE_URL = process.env['DATABASE_URL'] ?? process.env['MOTOR_DATABASE_URL'] ?? '';

async function insertJob(pool: Pool): Promise<string> {
  const jobId = '00000000-0000-0000-0000-000000000099';
  await pool.query(
    `INSERT INTO clothos_core.jobs
       (job_id, queue, priority, status, tenant_slug, query_type, identifier, plan,
        payload, cost_reserved, max_attempts, correlation_id, requested_by)
     VALUES
       ($1, ${JobQueue.FULL}, 5, ${JobStatus.CLAIMED}, 'acme', 'finder', 'sha256-only', 'finder',
        '{"protocol_version":2}', 10, 2,
        '00000000-0000-0000-0000-000000000098',
        '00000000-0000-0000-0000-000000000097')`,
    [jobId],
  );
  return jobId;
}

describe('FinderJobRepository', () => {
  let pool: Pool;
  let repository: FinderJobRepository;

  beforeAll(() => {
    pool = new Pool({
      connectionString: DATABASE_URL,
      options: '-c search_path=clothos_core,public',
    });
    repository = new FinderJobRepository(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await truncateTables(pool);
  });

  it('persists ordered events, source execution, and provenance-linked artifact', async () => {
    const jobId = await insertJob(pool);
    await repository.appendEvent(jobId, JobEventType.PROGRESS, { source: 'escavador', stage: 1 });
    await repository.appendEvent(jobId, JobEventType.SOURCE_COMPLETED, {
      source: 'escavador',
      stage: 1,
    });
    const executionId = await repository.startSourceExecution({
      jobId,
      sourceId: 'escavador',
      stage: 1,
    });
    await repository.completeSourceExecution(executionId);
    await repository.saveArtifact({
      jobId,
      key: 'subject.name',
      value: { name: 'Acme Ltda' },
      provenance: {
        sourceId: 'escavador',
        sourceExecutionId: executionId,
        extractor: 'subject_name/v1',
      },
    });

    const { rows: events } = await pool.query<{ sequence: string; event_type: string }>(
      'SELECT sequence, event_type FROM clothos_core.job_events WHERE job_id = $1 ORDER BY sequence',
      [jobId],
    );
    expect(events).toEqual([
      { sequence: '1', event_type: JobEventType.PROGRESS },
      { sequence: '2', event_type: JobEventType.SOURCE_COMPLETED },
    ]);

    const { rows: artifacts } = await pool.query<{
      source_execution_id: string;
      provenance: Record<string, unknown>;
    }>(
      'SELECT source_execution_id, provenance FROM clothos_core.derived_artifacts WHERE job_id = $1',
      [jobId],
    );
    expect(artifacts).toEqual([
      {
        source_execution_id: String(executionId),
        provenance: {
          sourceId: 'escavador',
          sourceExecutionId: executionId,
          extractor: 'subject_name/v1',
        },
      },
    ]);
  });

  it('writes source_code, cache_key and raw_result_id on a source execution', async () => {
    const jobId = await insertJob(pool);
    const executionId = await repository.startSourceExecution({
      jobId,
      sourceId: 'brasilapi',
      stage: 1,
    });
    const rawResultId = await repository.saveRawResult({
      gateway: 'brasilapi',
      fonte: 'brasilapi',
      tipoParam: 'cnpj',
      param: '11222333000181',
      result: { razao_social: 'Acme Ltda' },
      status: SourceExecutionStatus.COMPLETED,
      correlationId: '00000000-0000-0000-0000-000000000098',
      cacheKey: 'cache-key-1',
    });
    await repository.completeSourceExecution(executionId, {
      cacheHit: false,
      cacheKey: 'cache-key-1',
      rawResultId,
    });

    const { rows } = await pool.query<{
      source_code: string;
      cache_hit: boolean;
      cache_key: string;
      raw_result_id: string;
    }>(
      'SELECT source_code, cache_hit, cache_key, raw_result_id FROM clothos_core.job_source_executions WHERE id = $1',
      [executionId],
    );
    expect(rows[0]).toEqual({
      source_code: 'brasilapi',
      cache_hit: false,
      cache_key: 'cache-key-1',
      raw_result_id: String(rawResultId),
    });

    const { rows: raw } = await pool.query<{ cache_key: string }>(
      'SELECT cache_key FROM clothos_core.raw_results WHERE id = $1',
      [rawResultId],
    );
    expect(raw[0]?.cache_key).toBe('cache-key-1');
  });

  it('returns a cache value within TTL and null once expired', async () => {
    const value = { data: { razao_social: 'Acme Ltda' }, cost: 24 };
    await repository.saveCache('cache-key-live', value, 3600);
    expect(await repository.lookupCache('cache-key-live')).toEqual(value);

    // TTL negativo => expires_at no passado => miss.
    await repository.saveCache('cache-key-dead', value, -1);
    expect(await repository.lookupCache('cache-key-dead')).toBeNull();

    expect(await repository.lookupCache('cache-key-absent')).toBeNull();
  });
});
