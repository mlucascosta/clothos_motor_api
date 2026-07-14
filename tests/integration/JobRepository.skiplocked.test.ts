/**
 * @fileoverview Testes de integração — FOR UPDATE SKIP LOCKED (concorrência).
 *
 * Prova que o mecanismo de claim da fila é livre de duplo-processamento sob
 * carga concorrente real (sem mock). Cada asserção toca o banco diretamente.
 */

import { JobRepository } from '@infrastructure/database/JobRepository.js';
import { JobQueue, type JobQueueValue, JobStatus } from '@shared/domain/enums/queue.js';
import { Pool } from 'pg';
import { truncateTables } from './setup/truncate.js';

const DATABASE_URL = process.env['DATABASE_URL'] ?? process.env['MOTOR_DATABASE_URL'] ?? '';

// ---------------------------------------------------------------------------
// Fábrica de job mínimo válido
// ---------------------------------------------------------------------------
let jobSeq = 0;
function makeJobInsert(opts: {
  queue?: JobQueueValue;
  priority?: number;
  availableAt?: string; // SQL expression
}): string {
  jobSeq++;
  const queue = opts.queue ?? JobQueue.LITE;
  const priority = opts.priority ?? 5;
  const availableAt = opts.availableAt ?? 'now()';
  return `(
    gen_random_uuid(),
    ${queue},
    ${priority},
    ${JobStatus.PENDING},
    'acme',
    'cpf',
    'abc123${String(jobSeq).padStart(6, '0')}',
    'finder_team',
    '{}',
    1,
    0,
    2,
    ${availableAt},
    gen_random_uuid(),
    gen_random_uuid()
  )`;
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('JobRepository — FOR UPDATE SKIP LOCKED', () => {
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
  // Teste 1: zero duplicatas sob M claims concorrentes
  // -------------------------------------------------------------------------
  it('N=50 jobs, M=20 claims concorrentes — zero duplicatas, cada job claimado por exatamente um worker', async () => {
    // Arrange: insere 50 jobs pending
    const N = 50;
    const M = 20;
    const rows = Array.from({ length: N }, () => makeJobInsert({ queue: JobQueue.LITE }));
    await pool.query(
      `INSERT INTO clothos_core.jobs
         (job_id, queue, priority, status, tenant_slug, query_type, identifier, plan,
          payload, cost_reserved, cost_actual, max_attempts, available_at,
          correlation_id, requested_by)
       VALUES ${rows.join(',')}`,
    );

    // Act: M claims concorrentes via Promise.all
    const claims = await Promise.all(
      Array.from({ length: M }, () => repo.claimNext(JobQueue.LITE)),
    );

    // Assert: sem null no início (M <= N, todos devem ter claimado)
    const successful = claims.filter((j) => j !== null);
    expect(successful).toHaveLength(M); // todos os M claims bem-sucedidos

    // Zero duplicatas: cada job_id aparece no máximo uma vez
    const ids = successful.map((j) => j?.job_id);
    const unique = new Set(ids);
    expect(unique.size).toBe(M); // sem repetição

    // Status no banco: exatamente M claimed, 30 ainda pending
    const { rows: stats } = await pool.query<{ status: string; count: string }>(
      'SELECT status, count(*) AS count FROM clothos_core.jobs GROUP BY status ORDER BY status',
    );
    const byStatus = Object.fromEntries(stats.map((r) => [r.status, Number(r.count)]));
    expect(byStatus[JobStatus.CLAIMED]).toBe(M);
    expect(byStatus[JobStatus.PENDING]).toBe(N - M);
  });

  // -------------------------------------------------------------------------
  // Teste 2: retorna null quando fila está vazia
  // -------------------------------------------------------------------------
  it('retorna null quando não há jobs pending na queue', async () => {
    const result = await repo.claimNext(JobQueue.LITE);
    expect(result).toBeNull();
  });

  // -------------------------------------------------------------------------
  // Teste 3: jobs com available_at futuro NÃO são claimados
  // -------------------------------------------------------------------------
  it('jobs com available_at no futuro não são claimados (agendamento/backoff)', async () => {
    // Insere 1 job disponível agora e 3 jobs com available_at = now() + 1 hora
    await pool.query(
      `INSERT INTO clothos_core.jobs
         (job_id, queue, priority, status, tenant_slug, query_type, identifier, plan,
          payload, cost_reserved, cost_actual, max_attempts, available_at,
          correlation_id, requested_by)
       VALUES
         (gen_random_uuid(),${JobQueue.LITE},5,${JobStatus.PENDING},'acme','cpf','id0001','finder_team','{}',1,0,2, now(), gen_random_uuid(), gen_random_uuid()),
         (gen_random_uuid(),${JobQueue.LITE},5,${JobStatus.PENDING},'acme','cpf','id0002','finder_team','{}',1,0,2, now() + interval '1 hour', gen_random_uuid(), gen_random_uuid()),
         (gen_random_uuid(),${JobQueue.LITE},5,${JobStatus.PENDING},'acme','cpf','id0003','finder_team','{}',1,0,2, now() + interval '1 hour', gen_random_uuid(), gen_random_uuid()),
         (gen_random_uuid(),${JobQueue.LITE},5,${JobStatus.PENDING},'acme','cpf','id0004','finder_team','{}',1,0,2, now() + interval '1 hour', gen_random_uuid(), gen_random_uuid())
      `,
    );

    // Apenas 1 deve ser claimado (o disponível agora)
    const first = await repo.claimNext(JobQueue.LITE);
    const second = await repo.claimNext(JobQueue.LITE);

    expect(first).not.toBeNull();
    expect(second).toBeNull(); // os 3 restantes têm available_at futuro
  });

  // -------------------------------------------------------------------------
  // Teste 4: ordenação por priority — menor número (maior prioridade) primeiro
  // -------------------------------------------------------------------------
  it('jobs de priority=1 são claimados antes de priority=5', async () => {
    // Insere 3 jobs com priorities diferentes (inseridos fora de ordem)
    await pool.query(
      `INSERT INTO clothos_core.jobs
         (job_id, queue, priority, status, tenant_slug, query_type, identifier, plan,
          payload, cost_reserved, cost_actual, max_attempts, available_at,
          correlation_id, requested_by)
       VALUES
         (gen_random_uuid(),${JobQueue.FULL},5,${JobStatus.PENDING},'acme','cpf','low_prio', 'finder_team','{}',1,0,2, now(), gen_random_uuid(), gen_random_uuid()),
         (gen_random_uuid(),${JobQueue.FULL},1,${JobStatus.PENDING},'acme','cpf','high_prio','finder_team','{}',1,0,2, now(), gen_random_uuid(), gen_random_uuid()),
         (gen_random_uuid(),${JobQueue.FULL},3,${JobStatus.PENDING},'acme','cpf','mid_prio', 'finder_team','{}',1,0,2, now(), gen_random_uuid(), gen_random_uuid())
      `,
    );

    const first = await repo.claimNext(JobQueue.FULL);
    const second = await repo.claimNext(JobQueue.FULL);
    const third = await repo.claimNext(JobQueue.FULL);

    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(third).not.toBeNull();

    // ORDER BY priority ASC: 1 → 3 → 5
    expect(first?.priority).toBe(1);
    expect(second?.priority).toBe(3);
    expect(third?.priority).toBe(5);
  });

  // -------------------------------------------------------------------------
  // Teste 5: N > M — M claims bem-sucedidos, excedentes retornam null
  // -------------------------------------------------------------------------
  it('N=5 jobs, M=8 claims — 5 bem-sucedidos, 3 retornam null', async () => {
    const N = 5;
    await pool.query(
      `INSERT INTO clothos_core.jobs
         (job_id, queue, priority, status, tenant_slug, query_type, identifier, plan,
          payload, cost_reserved, cost_actual, max_attempts, available_at,
          correlation_id, requested_by)
       VALUES
         (gen_random_uuid(),${JobQueue.GRAPH},5,${JobStatus.PENDING},'acme','cpf','g1','finder_team','{}',1,0,2,now(),gen_random_uuid(),gen_random_uuid()),
         (gen_random_uuid(),${JobQueue.GRAPH},5,${JobStatus.PENDING},'acme','cpf','g2','finder_team','{}',1,0,2,now(),gen_random_uuid(),gen_random_uuid()),
         (gen_random_uuid(),${JobQueue.GRAPH},5,${JobStatus.PENDING},'acme','cpf','g3','finder_team','{}',1,0,2,now(),gen_random_uuid(),gen_random_uuid()),
         (gen_random_uuid(),${JobQueue.GRAPH},5,${JobStatus.PENDING},'acme','cpf','g4','finder_team','{}',1,0,2,now(),gen_random_uuid(),gen_random_uuid()),
         (gen_random_uuid(),${JobQueue.GRAPH},5,${JobStatus.PENDING},'acme','cpf','g5','finder_team','{}',1,0,2,now(),gen_random_uuid(),gen_random_uuid())
      `,
    );

    const M = 8;
    const claims = await Promise.all(
      Array.from({ length: M }, () => repo.claimNext(JobQueue.GRAPH)),
    );

    const ok = claims.filter((j) => j !== null);
    const nulls = claims.filter((j) => j === null);

    expect(ok).toHaveLength(N);
    expect(nulls).toHaveLength(M - N);
  });
});
