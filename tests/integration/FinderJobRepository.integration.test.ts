import { FinderJobRepository } from '@infrastructure/database/FinderJobRepository.js';
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
       ($1, 'full', 5, 'claimed', 'acme', 'finder', 'sha256-only', 'finder',
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
    await repository.appendEvent(jobId, 'progress', { source: 'escavador', stage: 1 });
    await repository.appendEvent(jobId, 'source_completed', { source: 'escavador', stage: 1 });
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
      { sequence: '1', event_type: 'progress' },
      { sequence: '2', event_type: 'source_completed' },
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
});
