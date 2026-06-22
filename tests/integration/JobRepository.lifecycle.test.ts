/**
 * @fileoverview Testes de integração — Ciclo de vida completo de um job.
 *
 * Exercita idempotência de enqueue, complete (JSONB roundtrip), fail com
 * backoff/DLQ, listDlq, reprocess e getWaitingCount contra banco real.
 */

import { JobRepository } from '@infrastructure/database/JobRepository.js';
import { Pool } from 'pg';
import { truncateTables } from './setup/truncate.js';

const DATABASE_URL = process.env['DATABASE_URL'] ?? process.env['MOTOR_DATABASE_URL'] ?? '';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function insertJob(
  pool: Pool,
  opts: {
    queue?: string;
    maxAttempts?: number;
    jobId?: string;
  } = {},
): Promise<number> {
  const queue = opts.queue ?? 'lite';
  const maxAttempts = opts.maxAttempts ?? 2;
  const jobId = opts.jobId ?? null; // null → gen_random_uuid()

  const jobIdExpr = jobId ? `'${jobId}'::uuid` : 'gen_random_uuid()';

  const { rows } = await pool.query<{ id: number }>(
    `INSERT INTO clothos_core.jobs
       (job_id, queue, priority, status, tenant_slug, query_type, identifier, plan,
        payload, cost_reserved, cost_actual, max_attempts, available_at,
        correlation_id, requested_by)
     VALUES
       (${jobIdExpr}, $1, 5, 'pending', 'acme', 'cpf', 'abc123', 'finder_team',
        '{}', 1, 0, $2, now(), gen_random_uuid(), gen_random_uuid())
     RETURNING id`,
    [queue, maxAttempts],
  );
  return rows[0]?.id;
}

async function getJob(pool: Pool, id: number) {
  const { rows } = await pool.query('SELECT * FROM clothos_core.jobs WHERE id = $1', [id]);
  return rows[0] ?? null;
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('JobRepository — Ciclo de vida', () => {
  let pool: Pool;
  let repo: JobRepository;

  beforeAll(() => {
    pool = new Pool({
      connectionString: DATABASE_URL,
      options: '-c search_path=clothos_core,public',
    });
    repo = new JobRepository(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await truncateTables(pool);
  });

  // -------------------------------------------------------------------------
  // Teste 1: idempotência de enqueue — 2º insert com mesmo job_id viola UNIQUE
  // -------------------------------------------------------------------------
  it('inserir 2 jobs com mesmo job_id viola UNIQUE constraint', async () => {
    const fixedJobId = '11111111-1111-1111-1111-111111111111';

    await insertJob(pool, { jobId: fixedJobId });

    await expect(insertJob(pool, { jobId: fixedJobId })).rejects.toThrow(
      /duplicate key value violates unique constraint/,
    );
  });

  // -------------------------------------------------------------------------
  // Teste 2: complete() — status + roundtrip JSONB fiel
  // -------------------------------------------------------------------------
  it('complete() grava result JSONB e status; roundtrip fiel para objeto aninhado', async () => {
    const id = await insertJob(pool);
    const job = await repo.claimNext('lite');
    expect(job).not.toBeNull();

    const deepResult = {
      score: 7.5,
      details: {
        dimensoes: ['financeiro', 'juridico'],
        fontes: { escavador: true, datajud: false },
        nested: { a: { b: { c: 42 } } },
      },
      tags: ['pep', 'risco_alto'],
    };

    await repo.complete(job?.id, deepResult, 3);

    const updated = await getJob(pool, id);
    expect(updated.status).toBe('completed');
    expect(updated.cost_actual).toBe(3);

    // JSONB roundtrip — o driver pg retorna o objeto parseado
    const resultParsed =
      typeof updated.result === 'string' ? JSON.parse(updated.result) : updated.result;
    expect(resultParsed).toEqual(deepResult);
  });

  // -------------------------------------------------------------------------
  // Teste 3: complete() com status='partial'
  // -------------------------------------------------------------------------
  it('complete() com status=partial grava corretamente', async () => {
    await insertJob(pool);
    const job = await repo.claimNext('lite');
    expect(job).not.toBeNull();

    await repo.complete(job?.id, { parcial: true }, 1, 'partial');

    const updated = await getJob(pool, job?.id);
    expect(updated.status).toBe('partial');
  });

  // -------------------------------------------------------------------------
  // Teste 4: fail() com attempts < max_attempts → backoff (pending + available_at futuro)
  // -------------------------------------------------------------------------
  it('fail() com attempts < max_attempts volta a pending com available_at futuro', async () => {
    // max_attempts=3: após 1 claim (attempts=1), fail → ainda 1 < 3
    await insertJob(pool, { maxAttempts: 3 });
    const job = await repo.claimNext('lite');
    expect(job).not.toBeNull();
    expect(job?.attempts).toBe(1); // incrementado pelo claim

    await repo.fail(job?.id, { error: 'upstream_timeout' });

    const updated = await getJob(pool, job?.id);
    expect(updated.status).toBe('pending');
    // available_at deve ser > now (backoff aplicado)
    expect(new Date(updated.available_at).getTime()).toBeGreaterThan(Date.now());
  });

  // -------------------------------------------------------------------------
  // Teste 5: fail() com attempts >= max_attempts → DLQ (status=failed)
  // -------------------------------------------------------------------------
  it('fail() com attempts >= max_attempts manda para DLQ (status=failed)', async () => {
    // max_attempts=1: após 1 claim (attempts=1), fail → 1 >= 1 → DLQ
    await insertJob(pool, { maxAttempts: 1 });
    const job = await repo.claimNext('lite');
    expect(job).not.toBeNull();
    expect(job?.attempts).toBe(1);

    await repo.fail(job?.id, { error: 'max_retries_exceeded' });

    const updated = await getJob(pool, job?.id);
    expect(updated.status).toBe('failed');
  });

  // -------------------------------------------------------------------------
  // Teste 6: listDlq() retorna apenas jobs failed com attempts >= max_attempts
  // -------------------------------------------------------------------------
  it('listDlq() retorna apenas jobs esgotados; jobs em outros estados não aparecem', async () => {
    // Cria 2 DLQ jobs, 1 pending, 1 completed
    const idA = await insertJob(pool, { maxAttempts: 1 });
    const idB = await insertJob(pool, { maxAttempts: 1 });
    await insertJob(pool); // pending — não deve aparecer

    // Coloca idA e idB em DLQ
    for (const pendingId of [idA, idB]) {
      await repo.claimNext('lite');
      const j = await getJob(pool, pendingId);
      await repo.fail(j.id, { error: 'forced' });
    }

    // Cria e conclui 1 job (completed — não deve aparecer)
    const idC = await insertJob(pool);
    const claimedC = await repo.claimNext('lite');
    expect(claimedC).not.toBeNull();
    await repo.complete(claimedC?.id, {}, 0);

    const dlq = await repo.listDlq();
    expect(dlq).toHaveLength(2);
    const dlqIds = dlq.map((j) => j.id);
    expect(dlqIds).toContain(idA);
    expect(dlqIds).toContain(idB);
    expect(dlqIds).not.toContain(idC);
    // Todos devem ter status=failed
    expect(dlq.every((j) => j.status === 'failed')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Teste 7: reprocess() reenfileira job da DLQ
  // -------------------------------------------------------------------------
  it('reprocess() reseta attempts para 0 e status para pending', async () => {
    await insertJob(pool, { maxAttempts: 1 });
    const job = await repo.claimNext('lite');
    expect(job).not.toBeNull();
    await repo.fail(job?.id, { error: 'forced' });

    const dlqBefore = await repo.listDlq();
    expect(dlqBefore).toHaveLength(1);

    await repo.reprocess(job?.id);

    const dlqAfter = await repo.listDlq();
    expect(dlqAfter).toHaveLength(0); // saiu da DLQ

    const updated = await getJob(pool, job?.id);
    expect(updated.status).toBe('pending');
    expect(updated.attempts).toBe(0);
    // available_at deve ser <= now (imediatamente disponível)
    expect(new Date(updated.available_at).getTime()).toBeLessThanOrEqual(Date.now() + 1000);
  });

  // -------------------------------------------------------------------------
  // Teste 8: getWaitingCount() conta corretamente por queue
  // -------------------------------------------------------------------------
  it('getWaitingCount() retorna contagem precisa por queue, ignorando outras filas', async () => {
    // 3 pending em 'lite', 2 pending em 'full', 1 claimed em 'lite'
    await insertJob(pool, { queue: 'lite' });
    await insertJob(pool, { queue: 'lite' });
    await insertJob(pool, { queue: 'lite' });
    await insertJob(pool, { queue: 'full' });
    await insertJob(pool, { queue: 'full' });

    // Claim 1 job de 'lite' para tirá-lo de pending
    await repo.claimNext('lite');

    const liteCount = await repo.getWaitingCount('lite');
    const fullCount = await repo.getWaitingCount('full');
    const graphCount = await repo.getWaitingCount('graph');

    expect(liteCount).toBe(2); // 3 - 1 claimed
    expect(fullCount).toBe(2);
    expect(graphCount).toBe(0);
  });

  // -------------------------------------------------------------------------
  // Teste 9: fail() em job inexistente não lança (early return)
  // -------------------------------------------------------------------------
  it('fail() em job inexistente não lança erro', async () => {
    await expect(repo.fail(999999, { error: 'ghost' })).resolves.toBeUndefined();
  });
});
