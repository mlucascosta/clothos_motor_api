/**
 * @fileoverview Repositório de jobs na tabela reduto_core.jobs (ADR-0019).
 * Implementa claim atômico via FOR UPDATE SKIP LOCKED, ownership por token,
 * lease renovável, recuperação de claim expirada e DLQ por query SQL.
 *
 * Referências:
 *   - ADR-0019 linhas 70-83: query de claim SKIP LOCKED
 *   - docs/spec/00-FOUNDATION.md: idempotência e invariantes do claim
 *   - docs/spec/00-FOUNDATION.md: DLQ sem infraestrutura extra
 *
 * @module infrastructure/database/JobRepository
 */

import { type JobQueueValue, JobStatus, type JobStatusValue } from '@shared/domain/enums/queue.js';
import { logger } from '@shared/infrastructure/logger.js';
import type { Pool } from 'pg';

// ---------------------------------------------------------------------------
// Constantes de backoff exponencial
// ---------------------------------------------------------------------------

/** Base de espera em segundos para o primeiro retry (attempts=1 -> 10s). */
const BACKOFF_BASE_SECONDS = 10;
/** Teto de backoff em segundos — nunca exceder 10 minutos. */
const BACKOFF_MAX_SECONDS = 600;
/** Duração padrão da lease de um claim. */
const DEFAULT_LEASE_DURATION_MS = 30_000;
/** Máximo de claims expirados recuperados em uma operação. */
const DEFAULT_RECLAIM_LIMIT = 100;

/**
 * Valida valores usados em duração de lease e batch de recuperação antes de
 * interpolá-los como parâmetros numéricos na query.
 */
function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
}

// ---------------------------------------------------------------------------
// Tipo JobRow
// ---------------------------------------------------------------------------

/**
 * Linha da tabela reduto_core.jobs retornada pelo driver `pg`.
 * Mapeamento direto das colunas definidas em ADR-0019 (sem `any`).
 */
export interface JobRow {
  /** PK autoincrementada. */
  id: number;
  /** UUID único para idempotência de enqueue. */
  job_id: string;
  /** Fila: lite | full | graph | dossier | export | custom */
  queue: string;
  /** Prioridade 1 (alta) … 10 (baixa). */
  priority: number;
  /** Status atual: pending | claimed | completed | partial | failed */
  status: string;
  /** Rótulo de correlação — motor NÃO isola por tenant (ADR-0019). */
  tenant_slug: string;
  query_type: string;
  /** CPF=SHA-256 | CNPJ=plaintext. */
  identifier: string;
  plan: string;
  /** Payload JSON do job. Pode ser objeto ou string dependendo do modo de parse do pg. */
  payload: Record<string, unknown> | string;
  /** Resultado escrito pelo motor após processamento. */
  result: Record<string, unknown> | string | null;
  cost_reserved: number;
  cost_actual: number | null;
  attempts: number;
  max_attempts: number;
  available_at: Date;
  claimed_at: Date | null;
  claimed_by: string | null;
  /** UUID generated for each claim; authorizes heartbeat and terminal writes. */
  claim_token: string | null;
  /** Claim becomes invalid at this timestamp unless owner heartbeats. */
  lease_expires_at: Date | null;
  correlation_id: string;
  requested_by: string;
  created_at: Date;
  updated_at: Date;
}

// ---------------------------------------------------------------------------
// Worker identity
// ---------------------------------------------------------------------------

export interface JobRepositoryOptions {
  /** Stable worker identity for operational tracing. */
  workerId?: string;
  /** Duration applied to a new claim or successful heartbeat. */
  leaseDurationMs?: number;
}

// ---------------------------------------------------------------------------
// JobRepository
// ---------------------------------------------------------------------------

/**
 * Repositório de jobs PostgreSQL (reduto_core.jobs).
 *
 * @example
 * const repo = new JobRepository(pool);
 * const job = await repo.claimNext('full');
 * if (job) {
 *   await repo.complete(job.id, job.claim_token, resultPayload, 3);
 * }
 */
export class JobRepository {
  private readonly workerId: string;
  private readonly leaseDurationMs: number;

  constructor(
    private readonly pool: Pool,
    options: JobRepositoryOptions = {},
  ) {
    this.workerId = options.workerId ?? process.env['WORKER_ID'] ?? `worker-${process.pid}`;
    this.leaseDurationMs = options.leaseDurationMs ?? DEFAULT_LEASE_DURATION_MS;
    assertPositiveInteger(this.leaseDurationMs, 'leaseDurationMs');
  }

  /**
   * Faz claim atômico do próximo job pendente na `queue` especificada.
   *
   * Query diretamente da ADR-0019 (linhas 70-83): CTE com FOR UPDATE SKIP LOCKED +
   * UPDATE SET status='claimed' na mesma instrução. Garante que cada worker
   * obtém job distinto sem bloquear os demais e sem duplo processamento.
   *
   * @param {string} queue - Valor da coluna `queue` (ex: 'lite', 'full')
   * @returns {Promise<JobRow | null>} Job claimado ou null se fila vazia
   */
  async claimNext(queue: JobQueueValue): Promise<JobRow | null> {
    const { rows } = await this.pool.query<JobRow>(
      `WITH next AS (
         SELECT id FROM reduto_core.jobs
         WHERE status = ${JobStatus.PENDING} AND queue = $1 AND available_at <= now()
         ORDER BY priority, available_at
         FOR UPDATE SKIP LOCKED
         LIMIT 1
       )
       UPDATE reduto_core.jobs j
           SET status     = ${JobStatus.CLAIMED},
               claimed_at = now(),
               claimed_by = $2,
               claim_token = gen_random_uuid(),
               lease_expires_at = now() + ($3 * interval '1 millisecond'),
               attempts   = attempts + 1,
              updated_at = now()
         FROM next
        WHERE j.id = next.id
       RETURNING j.*`,
      [queue, this.workerId, this.leaseDurationMs],
    );
    return rows[0] ?? null;
  }

  /**
   * Marca o job como concluído, gravando o resultado JSONB e o custo real.
   *
   * A lease must still be active. An expired owner cannot finalize before or
   * after another worker recovers the job.
   *
   * @param {number} id         - PK do job (coluna `id`)
   * @param {string} claimToken - Token recebido por `claimNext()`
   * @param {Record<string, unknown>} result    - Resultado serializado como JSONB
   * @param {number} costActual - Custo efetivo em créditos
   * @param {'completed' | 'partial'} status   - Status de conclusão
   * @returns {Promise<boolean>} true when this worker owned and finalized job
   */
  async complete(
    id: number,
    claimToken: string,
    result: Record<string, unknown>,
    costActual: number,
    status: JobStatusValue = JobStatus.COMPLETED,
  ): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      `UPDATE reduto_core.jobs
           SET status      = $2,
               result      = $3,
               cost_actual = $4,
               claimed_at = NULL,
               claimed_by = NULL,
               claim_token = NULL,
               lease_expires_at = NULL,
               updated_at  = now()
         WHERE id = $1
           AND status = ${JobStatus.CLAIMED}
           AND claim_token = $5::uuid
           AND lease_expires_at > now()`,
      [id, status, JSON.stringify(result), costActual, claimToken],
    );
    return rowCount === 1;
  }

  /**
   * Renova lease de um job para seu worker dono. Leases expiradas never revive.
   */
  async heartbeat(id: number, claimToken: string): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      `UPDATE reduto_core.jobs
          SET lease_expires_at = now() + ($3 * interval '1 millisecond'),
              updated_at = now()
        WHERE id = $1
          AND status = ${JobStatus.CLAIMED}
          AND claim_token = $2::uuid
          AND lease_expires_at > now()`,
      [id, claimToken, this.leaseDurationMs],
    );
    return rowCount === 1;
  }

  /**
   * Registra falha no job.
   *
   * Política de retry/backoff (ADR-0019 §9):
   *   - Se `attempts < max_attempts`: status='pending', available_at=now()+backoff(attempts)
   *   - Caso contrário: status='failed' (linha vira DLQ — listada por `listDlq()`)
   *
   * This single guarded UPDATE makes retry/DLQ choice from current row values,
   * so a stale owner cannot overwrite terminal state or a new claim.
   *
   * @param {number} id - PK do job
   * @param {string} claimToken - Token recebido por `claimNext()`
   * @param {{ error?: string }} opts - Opções de falha (mensagem de erro opcional)
   * @returns {Promise<boolean>} true when this worker owned job
   */
  async fail(id: number, claimToken: string, opts: { error?: string } = {}): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      `UPDATE reduto_core.jobs
          SET status = CASE WHEN attempts < max_attempts THEN ${JobStatus.PENDING} ELSE ${JobStatus.FAILED} END,
              available_at = CASE
                WHEN attempts < max_attempts THEN now() + (
                  LEAST(
                    $3::double precision * power(2::double precision, GREATEST(attempts - 1, 0)),
                    $4::double precision
                  ) * interval '1 second'
                )
                ELSE available_at
              END,
              result = CASE
                WHEN attempts >= max_attempts THEN COALESCE(result, $5::jsonb)
                ELSE result
              END,
              claimed_at = NULL,
              claimed_by = NULL,
              claim_token = NULL,
              lease_expires_at = NULL,
              updated_at = now()
        WHERE id = $1
          AND status = ${JobStatus.CLAIMED}
          AND claim_token = $2::uuid
          AND lease_expires_at > now()`,
      [
        id,
        claimToken,
        BACKOFF_BASE_SECONDS,
        BACKOFF_MAX_SECONDS,
        JSON.stringify({ failure_reason: opts.error ?? 'unknown' }),
      ],
    );
    return rowCount === 1;
  }

  /**
   * Recovers expired claims without racing owners or other reapers. A claim is
   * selected and transitioned in same statement under SKIP LOCKED.
   */
  async reclaimExpired(limit = DEFAULT_RECLAIM_LIMIT): Promise<number> {
    assertPositiveInteger(limit, 'limit');

    const { rowCount } = await this.pool.query(
      `WITH expired AS (
         SELECT id
           FROM reduto_core.jobs
          WHERE status = ${JobStatus.CLAIMED}
            AND (lease_expires_at IS NULL OR lease_expires_at <= now())
          ORDER BY lease_expires_at NULLS FIRST, claimed_at
          FOR UPDATE SKIP LOCKED
          LIMIT $1
       )
       UPDATE reduto_core.jobs j
          SET status = CASE WHEN j.attempts < j.max_attempts THEN ${JobStatus.PENDING} ELSE ${JobStatus.FAILED} END,
              available_at = CASE
                WHEN j.attempts < j.max_attempts THEN now() + (
                  LEAST(
                    $2::double precision * power(2::double precision, GREATEST(j.attempts - 1, 0)),
                    $3::double precision
                  ) * interval '1 second'
                )
                ELSE j.available_at
              END,
              result = CASE
                WHEN j.attempts >= j.max_attempts THEN COALESCE(
                  j.result,
                  '{"failure_reason":"lease_expired"}'::jsonb
                )
                ELSE j.result
              END,
              claimed_at = NULL,
              claimed_by = NULL,
              claim_token = NULL,
              lease_expires_at = NULL,
              updated_at = now()
         FROM expired
        WHERE j.id = expired.id
       RETURNING j.id`,
      [limit, BACKOFF_BASE_SECONDS, BACKOFF_MAX_SECONDS],
    );

    if ((rowCount ?? 0) > 0) {
      logger.warn({ count: rowCount }, 'JobRepository.reclaimExpired: recovered expired claims');
    }
    return rowCount ?? 0;
  }

  /**
   * Conta jobs aguardando processamento (status='pending') na `queue`.
   * Usado para backpressure check antes de aceitar novas queries (PHASE_23 §5).
   *
   * @param {string} queue - Nome da fila
   * @returns {Promise<number>} Quantidade de jobs pending
   */
  async getWaitingCount(queue: string): Promise<number> {
    const { rows } = await this.pool.query<{ count: string }>(
      `SELECT count(*) AS count FROM reduto_core.jobs
        WHERE status = ${JobStatus.PENDING} AND queue = $1`,
      [queue],
    );
    return Number(rows[0]?.count ?? 0);
  }

  /**
   * Lista jobs na DLQ: status='failed' AND attempts >= max_attempts.
   * DLQ é implementada como query SQL (ADR-0019 §9) — sem tabela ou broker separado.
   *
   * @returns {Promise<JobRow[]>} Lista de jobs esgotados, ordenados por updated_at desc
   */
  async listDlq(): Promise<JobRow[]> {
    const { rows } = await this.pool.query<JobRow>(
      `SELECT * FROM reduto_core.jobs
        WHERE status = ${JobStatus.FAILED} AND attempts >= max_attempts
        ORDER BY updated_at DESC`,
    );
    return rows;
  }

  /**
   * Reenfileira um job da DLQ: reset de attempts e status='pending'.
   * Equivale ao "reprocess" do endpoint admin (PHASE_23 §9).
   *
   * @param {number} id - PK do job a reprocessar
   * @returns {Promise<void>}
   */
  async reprocess(id: number): Promise<void> {
    await this.pool.query(
      `UPDATE reduto_core.jobs
           SET status       = ${JobStatus.PENDING},
               attempts     = 0,
               available_at = now(),
               claimed_at = NULL,
               claimed_by = NULL,
               claim_token = NULL,
               lease_expires_at = NULL,
               updated_at   = now()
         WHERE id = $1
           AND status = ${JobStatus.FAILED}
           AND attempts >= max_attempts`,
      [id],
    );
  }
}
