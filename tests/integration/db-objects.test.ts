/**
 * @fileoverview Testes de integração — Objetos de banco (schema, índices, funções, views).
 *
 * Valida que o DDL foi aplicado corretamente: 6 tabelas existem, cache é UNLOGGED,
 * índice parcial idx_jobs_claim existe, EXPLAIN de claimNext usa index scan,
 * purge_expired_cache funciona e v_dlq reflete jobs failed.
 */

import { JobQueue, JobStatus } from '@shared/domain/enums/queue.js';
import { Pool } from 'pg';
import { truncateTables } from './setup/truncate.js';

const DATABASE_URL = process.env['DATABASE_URL'] ?? process.env['MOTOR_DATABASE_URL'] ?? '';

describe('Objetos de banco — DDL, índices, funções, views', () => {
  let pool: Pool;

  beforeAll(() => {
    pool = new Pool({
      connectionString: DATABASE_URL,
      options: '-c search_path=clothos_core,public',
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await truncateTables(pool);
  });

  // -------------------------------------------------------------------------
  // Teste 1: as 6 tabelas existem no schema clothos_core
  // -------------------------------------------------------------------------
  it('as 6 tabelas obrigatórias existem no schema clothos_core', async () => {
    const { rows } = await pool.query<{ tablename: string }>(
      `SELECT tablename
         FROM pg_tables
        WHERE schemaname = 'clothos_core'
          AND tablename IN ('jobs','raw_results','query_refs','providers','cache','jobs_history')
        ORDER BY tablename`,
    );

    const names = rows.map((r) => r.tablename);
    expect(names).toContain('jobs');
    expect(names).toContain('raw_results');
    expect(names).toContain('query_refs');
    expect(names).toContain('providers');
    expect(names).toContain('cache');
    expect(names).toContain('jobs_history');
    expect(names).toHaveLength(6);
  });

  // -------------------------------------------------------------------------
  // Teste 2: tabela cache é UNLOGGED (relpersistence = 'u')
  // -------------------------------------------------------------------------
  it("tabela cache tem relpersistence='u' (UNLOGGED)", async () => {
    const { rows } = await pool.query<{ relpersistence: string }>(
      `SELECT relpersistence
         FROM pg_class
        WHERE relnamespace = 'clothos_core'::regnamespace
          AND relname = 'cache'`,
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]?.relpersistence).toBe('u'); // 'u' = UNLOGGED, 'p' = permanent
  });

  // -------------------------------------------------------------------------
  // Teste 3: indice parcial idx_jobs_claim existe com o predicado NUMERICO (status = 0 = pending).
  // -------------------------------------------------------------------------
  it('idx_jobs_claim existe e tem predicado WHERE status = 0 (pending)', async () => {
    const { rows } = await pool.query<{ indexname: string; indexdef: string }>(
      `SELECT indexname, indexdef
         FROM pg_indexes
        WHERE schemaname = 'clothos_core'
          AND tablename = 'jobs'
          AND indexname = 'idx_jobs_claim'`,
    );

    expect(rows).toHaveLength(1);
    const def = rows[0]?.indexdef.toLowerCase();
    // O predicado deve aparecer na definição do índice.
    // Apos o ADR-0024 a coluna e SMALLINT: o predicado e numerico, sem cast de texto.
    expect(def).toMatch(new RegExp(`where \\(status = ${JobStatus.PENDING}\\)`));
    // Deve cobrir as colunas queue, priority, available_at
    expect(def).toContain('queue');
    expect(def).toContain('priority');
    expect(def).toContain('available_at');
  });

  // -------------------------------------------------------------------------
  // Teste 4: EXPLAIN de claimNext usa Index Scan sobre idx_jobs_claim
  // -------------------------------------------------------------------------
  it('EXPLAIN do claimNext usa idx_jobs_claim (Index Scan, não Seq Scan)', async () => {
    // Insere 500 jobs pending + ANALYZE para que o planner tenha estatísticas reais.
    // Com poucos registros o planner pode preferir Seq Scan — volume garante Index Scan.
    await pool.query(
      `INSERT INTO clothos_core.jobs
         (job_id, queue, priority, status, tenant_slug, query_type, identifier, plan,
          payload, cost_reserved, cost_actual, max_attempts, available_at,
          correlation_id, requested_by)
       SELECT
         gen_random_uuid(),
         ${JobQueue.LITE},
         (g % 10) + 1,
         ${JobStatus.PENDING},
         'acme',
         'cpf',
         'abc' || g,
         'finder_team',
         '{}',
         1, 0, 2,
         now(),
         gen_random_uuid(),
         gen_random_uuid()
       FROM generate_series(1, 500) AS g`,
    );
    // Atualiza estatísticas para que o planner veja a distribuição real
    await pool.query('ANALYZE clothos_core.jobs');

    // Desativa seqscan na sessão para forçar o planner a escolher o índice parcial.
    // Isso prova que idx_jobs_claim é válido e utilizável pelo planner — sem o índice
    // o planner reportaria "index not available" em vez de usá-lo.
    const client = await pool.connect();
    let plan = '';
    try {
      await client.query('SET enable_seqscan = off');
      // pg retorna a coluna como "QUERY PLAN" (maiúsculas) — usamos Object.values
      // para obter o valor independente do casing da key.
      const { rows } = await client.query(
        `EXPLAIN (FORMAT TEXT)
         WITH next AS (
           SELECT id FROM clothos_core.jobs
           WHERE status = ${JobStatus.PENDING} AND queue = $1 AND available_at <= now()
           ORDER BY priority, available_at
           FOR UPDATE SKIP LOCKED
           LIMIT 1
         )
         UPDATE clothos_core.jobs j
            SET status     = ${JobStatus.CLAIMED},
                claimed_at = now(),
                claimed_by = 'test-worker',
                attempts   = attempts + 1,
                updated_at = now()
           FROM next
          WHERE j.id = next.id
         RETURNING j.*`,
        [JobQueue.LITE],
      );
      plan = rows
        .map((r) => String(Object.values(r)[0]))
        .join('\n')
        .toLowerCase();
    } finally {
      await client.query('SET enable_seqscan = on');
      client.release();
    }

    // Com seqscan desativado, o planner DEVE usar idx_jobs_claim
    expect(plan).toContain('idx_jobs_claim');
  });

  // -------------------------------------------------------------------------
  // Teste 5: purge_expired_cache() remove apenas entradas expiradas
  // -------------------------------------------------------------------------
  it('purge_expired_cache() remove entradas expiradas e retorna a contagem', async () => {
    // Insere 3 entradas: 2 expiradas + 1 válida
    await pool.query(
      `INSERT INTO clothos_core.cache (key, value, expires_at)
       VALUES
         ('expired-1', '{"v":1}', now() - interval '1 hour'),
         ('expired-2', '{"v":2}', now() - interval '30 minutes'),
         ('valid-1',   '{"v":3}', now() + interval '1 hour')`,
    );

    const { rows } = await pool.query<{ purge_expired_cache: number }>(
      'SELECT clothos_core.purge_expired_cache() AS purge_expired_cache',
    );
    const deleted = rows[0]?.purge_expired_cache;

    expect(deleted).toBe(2); // exatamente as 2 expiradas

    // Verifica que a entrada válida ainda existe
    const { rows: remaining } = await pool.query(
      `SELECT key FROM clothos_core.cache WHERE key = 'valid-1'`,
    );
    expect(remaining).toHaveLength(1);
  });

  // -------------------------------------------------------------------------
  // Teste 6: view v_dlq reflete jobs failed com attempts >= max_attempts
  // -------------------------------------------------------------------------
  it('v_dlq retorna apenas jobs failed com attempts >= max_attempts', async () => {
    // Insere jobs em diferentes estados para testar o filtro.
    // v_dlq expõe: id, job_id, queue, query_type, tenant_slug, attempts, max_attempts,
    //              result, payload, correlation_id, updated_at — NÃO expõe identifier.
    // Usamos job_id fixo para identificar os jobs DLQ.
    const dlqJobId1 = 'aaaaaaaa-0000-0000-0000-000000000001';
    const dlqJobId2 = 'aaaaaaaa-0000-0000-0000-000000000002';

    await pool.query(
      `INSERT INTO clothos_core.jobs
         (job_id, queue, priority, status, tenant_slug, query_type, identifier, plan,
          payload, cost_reserved, cost_actual, max_attempts, attempts, available_at,
          correlation_id, requested_by)
       VALUES
         -- DLQ: failed + attempts >= max_attempts
         ('${dlqJobId1}',${JobQueue.LITE},5,${JobStatus.FAILED},'acme','dlq_type','dlq1','finder_team','{}',1,0,2,2,now(),gen_random_uuid(),gen_random_uuid()),
         ('${dlqJobId2}',${JobQueue.LITE},5,${JobStatus.FAILED},'acme','dlq_type','dlq2','finder_team','{}',1,0,3,3,now(),gen_random_uuid(),gen_random_uuid()),
         -- NÃO DLQ: failed mas attempts < max_attempts
         (gen_random_uuid(),${JobQueue.LITE},5,${JobStatus.FAILED},'acme','not_dlq','not-dlq','finder_team','{}',1,0,3,2,now(),gen_random_uuid(),gen_random_uuid()),
         -- NÃO DLQ: pending
         (gen_random_uuid(),${JobQueue.LITE},5,${JobStatus.PENDING},'acme','pend_type','pend','finder_team','{}',1,0,2,0,now(),gen_random_uuid(),gen_random_uuid()),
         -- NÃO DLQ: completed
         (gen_random_uuid(),${JobQueue.LITE},5,${JobStatus.COMPLETED},'acme','done_type','done','finder_team','{}',1,1,2,1,now(),gen_random_uuid(),gen_random_uuid())`,
    );

    const { rows } = await pool.query<{ job_id: string }>(
      'SELECT job_id FROM clothos_core.v_dlq ORDER BY job_id',
    );

    const jobIds = rows.map((r) => r.job_id);
    expect(jobIds).toContain(dlqJobId1);
    expect(jobIds).toContain(dlqJobId2);
    expect(rows).toHaveLength(2); // apenas os 2 DLQ reais
  });

  // -------------------------------------------------------------------------
  // Teste 7: view v_queue_stats agrega corretamente
  // -------------------------------------------------------------------------
  it('v_queue_stats agrega jobs por (queue, status) corretamente', async () => {
    await pool.query(
      `INSERT INTO clothos_core.jobs
         (job_id, queue, priority, status, tenant_slug, query_type, identifier, plan,
          payload, cost_reserved, cost_actual, max_attempts, available_at,
          correlation_id, requested_by)
       SELECT
         gen_random_uuid(),
         CASE WHEN g <= 3 THEN ${JobQueue.LITE} ELSE ${JobQueue.FULL} END,
         5,
         CASE WHEN g <= 2 THEN ${JobStatus.PENDING} WHEN g = 3 THEN ${JobStatus.COMPLETED} ELSE ${JobStatus.PENDING} END,
         'acme', 'cpf', 'id' || g, 'finder_team', '{}', 1, 0, 2,
         now(), gen_random_uuid(), gen_random_uuid()
       FROM generate_series(1, 5) AS g`,
    );

    const { rows } = await pool.query<{ queue: string; status: string; total: string }>(
      'SELECT queue, status, total FROM clothos_core.v_queue_stats ORDER BY queue, status',
    );

    // A view traduz o numero de volta para o rotulo (ADR-0024): quem OPERA le texto.
    // lite: 2 pending + 1 completed; full: 2 pending
    const litePending = rows.find((r) => r.queue === 'lite' && r.status === 'pending');
    const liteCompleted = rows.find((r) => r.queue === 'lite' && r.status === 'completed');
    const fullPending = rows.find((r) => r.queue === 'full' && r.status === 'pending');

    expect(Number(litePending?.total)).toBe(2);
    expect(Number(liteCompleted?.total)).toBe(1);
    expect(Number(fullPending?.total)).toBe(2);
  });

  // -------------------------------------------------------------------------
  // Teste 8: 6 providers do seed existem na tabela
  // -------------------------------------------------------------------------
  it('seed de providers: 6 providers existem com circuit_breaker_state closed', async () => {
    const { rows } = await pool.query<{ slug: string; state: string }>(
      `SELECT slug, circuit_breaker_state->>'state' AS state
         FROM clothos_core.providers
        ORDER BY slug`,
    );

    expect(rows).toHaveLength(6);
    const slugs = rows.map((r) => r.slug);
    expect(slugs).toEqual([
      'apibrasil',
      'brasilapi',
      'datajud',
      'directdata',
      'escavador',
      'infosimples',
    ]);
    // Todos com estado inicial 'closed'
    expect(rows.every((r) => r.state === 'closed')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Teste 9: archive_old_jobs() arquiva jobs antigos para jobs_history
  // -------------------------------------------------------------------------
  it('archive_old_jobs() move jobs antigos para jobs_history e retorna contagem', async () => {
    // Insere 2 jobs completed com updated_at = 10 dias atrás
    await pool.query(
      `INSERT INTO clothos_core.jobs
         (job_id, queue, priority, status, tenant_slug, query_type, identifier, plan,
          payload, cost_reserved, cost_actual, max_attempts, available_at,
          correlation_id, requested_by, updated_at)
       VALUES
         (gen_random_uuid(),${JobQueue.LITE},5,${JobStatus.COMPLETED},'acme','cpf','arch1','finder_team','{}',1,0,2,now(),gen_random_uuid(),gen_random_uuid(), now() - interval '10 days'),
         (gen_random_uuid(),${JobQueue.LITE},5,${JobStatus.COMPLETED},'acme','cpf','arch2','finder_team','{}',1,0,2,now(),gen_random_uuid(),gen_random_uuid(), now() - interval '10 days'),
         -- Este deve permanecer (recente)
         (gen_random_uuid(),${JobQueue.LITE},5,${JobStatus.COMPLETED},'acme','cpf','recent','finder_team','{}',1,0,2,now(),gen_random_uuid(),gen_random_uuid(), now())`,
    );

    // Arquiva com retenção de 7 dias
    const { rows } = await pool.query<{ archive_old_jobs: number }>(
      `SELECT clothos_core.archive_old_jobs('7 days'::interval) AS archive_old_jobs`,
    );
    const archived = rows[0]?.archive_old_jobs;

    expect(archived).toBe(2);

    // Verifica que os 2 antigos foram para jobs_history
    const { rows: histRows } = await pool.query(
      'SELECT count(*) AS c FROM clothos_core.jobs_history',
    );
    expect(Number(histRows[0].c)).toBe(2);

    // O recente permanece em jobs
    const { rows: jobRows } = await pool.query(
      `SELECT identifier FROM clothos_core.jobs WHERE identifier = 'recent'`,
    );
    expect(jobRows).toHaveLength(1);
  });
});
