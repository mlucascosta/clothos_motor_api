import { JobRepository, type JobRow } from '@infrastructure/database/JobRepository.js';
import { JobQueue, JobStatus } from '@shared/domain/enums/queue.js';
import { Pool } from 'pg';
import { truncateTables } from './setup/truncate.js';

const DATABASE_URL = process.env['DATABASE_URL'] ?? process.env['MOTOR_DATABASE_URL'] ?? '';

function required<T>(value: T | null | undefined, label: string): T {
  if (value === null || value === undefined) throw new Error(`${label} was not returned`);
  return value;
}

function requireClaim(
  job: JobRow | null,
): JobRow & { claim_token: string; lease_expires_at: Date } {
  if (job === null || job.claim_token === null || job.lease_expires_at === null) {
    throw new Error('expected a claimed job with token and lease');
  }
  return job;
}

async function insertJob(pool: Pool, maxAttempts = 2): Promise<number> {
  const { rows } = await pool.query<{ id: number }>(
    `INSERT INTO clothos_core.jobs
       (job_id, queue, priority, status, tenant_slug, query_type, identifier, plan,
        payload, cost_reserved, max_attempts, available_at, correlation_id, requested_by)
     VALUES
       (gen_random_uuid(), ${JobQueue.LITE}, 5, ${JobStatus.PENDING}, 'acme', 'cnpj', '55760212000169', 'finder_team',
        '{}', 1, $1, now(), gen_random_uuid(), gen_random_uuid())
     RETURNING id`,
    [maxAttempts],
  );
  return required(rows[0], 'inserted job').id;
}

async function getJob(pool: Pool, id: number) {
  const { rows } = await pool.query('SELECT * FROM clothos_core.jobs WHERE id = $1', [id]);
  return required(rows[0], 'job');
}

describe('JobRepository - ownership and lease lifecycle', () => {
  let pool: Pool;
  let owner: JobRepository;
  let otherWorker: JobRepository;

  beforeAll(() => {
    pool = new Pool({
      connectionString: DATABASE_URL,
      options: '-c search_path=clothos_core,public',
    });
    owner = new JobRepository(pool, { workerId: 'worker-owner', leaseDurationMs: 10_000 });
    otherWorker = new JobRepository(pool, { workerId: 'worker-other', leaseDurationMs: 10_000 });
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await truncateTables(pool);
  });

  it('rejects heartbeat, completion and failure from a different claim token', async () => {
    const id = await insertJob(pool);
    const job = await owner.claimNext(JobQueue.LITE);
    const claimed = requireClaim(job);

    expect(claimed.claim_token).toMatch(/^[0-9a-f-]{36}$/i);
    expect(claimed.lease_expires_at).toBeInstanceOf(Date);

    const foreignToken = '00000000-0000-0000-0000-000000000000';
    await expect(otherWorker.heartbeat(id, foreignToken)).resolves.toBe(false);
    await expect(otherWorker.complete(id, foreignToken, { protocol_version: 1 }, 1)).resolves.toBe(
      false,
    );
    await expect(otherWorker.fail(id, foreignToken, { error: 'foreign_worker' })).resolves.toBe(
      false,
    );

    const unchanged = await getJob(pool, id);
    expect(unchanged.status).toBe(JobStatus.CLAIMED);
    expect(unchanged.claim_token).toBe(claimed.claim_token);
  });

  it('extends an active lease only for its owner', async () => {
    const id = await insertJob(pool);
    const job = await owner.claimNext(JobQueue.LITE);
    const claimed = requireClaim(job);
    const previousLease = claimed.lease_expires_at.getTime();

    await expect(owner.heartbeat(id, claimed.claim_token)).resolves.toBe(true);

    const updated = await getJob(pool, id);
    expect(new Date(updated.lease_expires_at).getTime()).toBeGreaterThanOrEqual(previousLease);
  });

  it('atomically recovers expired claims with bounded backoff and clears ownership', async () => {
    const id = await insertJob(pool, 2);
    const job = await owner.claimNext(JobQueue.LITE);
    const claimed = requireClaim(job);

    await pool.query(
      "UPDATE clothos_core.jobs SET lease_expires_at = now() - interval '1 second' WHERE id = $1",
      [id],
    );

    await expect(owner.complete(id, claimed.claim_token, { protocol_version: 1 }, 1)).resolves.toBe(
      false,
    );
    await expect(otherWorker.reclaimExpired()).resolves.toBe(1);

    const recovered = await getJob(pool, id);
    expect(recovered.status).toBe(JobStatus.PENDING);
    expect(recovered.claim_token).toBeNull();
    expect(recovered.lease_expires_at).toBeNull();
    expect(recovered.claimed_by).toBeNull();
    expect(new Date(recovered.available_at).getTime()).toBeGreaterThan(Date.now());

    await pool.query('UPDATE clothos_core.jobs SET available_at = now() WHERE id = $1', [id]);
    const reclaimed = requireClaim(await otherWorker.claimNext(JobQueue.LITE));
    expect(reclaimed.id).toBe(id);
    expect(reclaimed.claim_token).not.toBe(claimed.claim_token);
  });

  it('moves an expired final attempt to DLQ instead of retrying again', async () => {
    const id = await insertJob(pool, 1);
    requireClaim(await owner.claimNext(JobQueue.LITE));

    await pool.query(
      "UPDATE clothos_core.jobs SET lease_expires_at = now() - interval '1 second' WHERE id = $1",
      [id],
    );
    await expect(otherWorker.reclaimExpired()).resolves.toBe(1);

    const recovered = await getJob(pool, id);
    expect(recovered.status).toBe(JobStatus.FAILED);
    expect(recovered.attempts).toBe(1);
    expect(recovered.claim_token).toBeNull();
    expect(recovered.lease_expires_at).toBeNull();
    expect(recovered.result).toEqual({ failure_reason: 'lease_expired' });
  });

  it('allows one terminal write and prevents duplicate finalization', async () => {
    const id = await insertJob(pool);
    const job = await owner.claimNext(JobQueue.LITE);
    const claimed = requireClaim(job);
    const result = { protocol_version: 1, status: JobStatus.COMPLETED };

    await expect(owner.complete(id, claimed.claim_token, result, 3)).resolves.toBe(true);
    await expect(
      owner.complete(
        id,
        claimed.claim_token,
        { protocol_version: 1, status: JobStatus.PARTIAL },
        4,
        JobStatus.PARTIAL,
      ),
    ).resolves.toBe(false);
    await expect(owner.fail(id, claimed.claim_token, { error: 'late_failure' })).resolves.toBe(
      false,
    );

    const finalized = await getJob(pool, id);
    expect(finalized.status).toBe(JobStatus.COMPLETED);
    expect(finalized.cost_actual).toBe(3);
    expect(finalized.claim_token).toBeNull();
    expect(finalized.lease_expires_at).toBeNull();
    expect(finalized.result).toEqual(result);
  });
});
