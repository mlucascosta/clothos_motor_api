/**
 * @fileoverview Repositório de jobs na tabela clothos_core.jobs (ADR-0019).
 * Implementa claim atômico via FOR UPDATE SKIP LOCKED, complete, fail com retry/backoff
 * exponencial, DLQ por query SQL e operações de administração.
 *
 * Referências:
 *   - ADR-0019 linhas 70-83: query de claim SKIP LOCKED
 *   - PHASE_23_SPEC §8.4: idempotência e invariantes do claim
 *   - PHASE_23_SPEC §9: DLQ sem infra extra
 *
 * @module infrastructure/database/JobRepository
 */

import { logger } from '@shared/infrastructure/logger.js';
import type { Pool } from 'pg';

// ---------------------------------------------------------------------------
// Constantes de backoff exponencial
// ---------------------------------------------------------------------------

/** Base de espera em segundos para o primeiro retry (attempts=1 → ~10s). */
const BACKOFF_BASE_SECONDS = 10;
/** Teto de backoff em segundos — nunca exceder 10 minutos. */
const BACKOFF_MAX_SECONDS = 600;

/**
 * Calcula o offset de backoff exponencial em segundos para `attempts` tentativas.
 * `min(base * 2^(attempts-1), max)` com jitter inteiro simples.
 *
 * @param {number} attempts - Número de tentativas já realizadas (≥1)
 * @returns {number} Segundos de backoff (inteiro, ≥ BACKOFF_BASE_SECONDS)
 */
function backoffSeconds(attempts: number): number {
  const exp = BACKOFF_BASE_SECONDS * 2 ** (attempts - 1);
  return Math.min(exp, BACKOFF_MAX_SECONDS);
}

// ---------------------------------------------------------------------------
// Tipo JobRow
// ---------------------------------------------------------------------------

/**
 * Linha da tabela clothos_core.jobs retornada pelo driver `pg`.
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
  correlation_id: string;
  requested_by: string;
  created_at: Date;
  updated_at: Date;
}

// ---------------------------------------------------------------------------
// Worker identity
// ---------------------------------------------------------------------------

const WORKER_ID = process.env['WORKER_ID'] ?? `worker-${process.pid}`;

// ---------------------------------------------------------------------------
// JobRepository
// ---------------------------------------------------------------------------

/**
 * Repositório de jobs PostgreSQL (clothos_core.jobs).
 *
 * @example
 * const repo = new JobRepository(pool);
 * const job = await repo.claimNext('full');
 * if (job) {
 *   await repo.complete(job.id, resultPayload, 3);
 * }
 */
export class JobRepository {
  constructor(private readonly pool: Pool) {}

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
  async claimNext(queue: string): Promise<JobRow | null> {
    const { rows } = await this.pool.query<JobRow>(
      `WITH next AS (
         SELECT id FROM clothos_core.jobs
         WHERE status = 'pending' AND queue = $1 AND available_at <= now()
         ORDER BY priority, available_at
         FOR UPDATE SKIP LOCKED
         LIMIT 1
       )
       UPDATE clothos_core.jobs j
          SET status     = 'claimed',
              claimed_at = now(),
              claimed_by = $2,
              attempts   = attempts + 1,
              updated_at = now()
         FROM next
        WHERE j.id = next.id
       RETURNING j.*`,
      [queue, WORKER_ID],
    );
    return rows[0] ?? null;
  }

  /**
   * Marca o job como concluído, gravando o resultado JSONB e o custo real.
   *
   * @param {number} id         - PK do job (coluna `id`)
   * @param {Record<string, unknown>} result    - Resultado serializado como JSONB
   * @param {number} costActual - Custo efetivo em créditos
   * @param {'completed' | 'partial'} status   - Status de conclusão
   * @returns {Promise<void>}
   */
  async complete(
    id: number,
    result: Record<string, unknown>,
    costActual: number,
    status: 'completed' | 'partial' = 'completed',
  ): Promise<void> {
    await this.pool.query(
      `UPDATE clothos_core.jobs
          SET status      = $2,
              result      = $3,
              cost_actual = $4,
              updated_at  = now()
        WHERE id = $1`,
      [id, status, JSON.stringify(result), costActual],
    );
  }

  /**
   * Registra falha no job.
   *
   * Política de retry/backoff (ADR-0019 §9):
   *   - Se `attempts < max_attempts`: status='pending', available_at=now()+backoff(attempts)
   *   - Caso contrário: status='failed' (linha vira DLQ — listada por `listDlq()`)
   *
   * @param {number} id - PK do job
   * @param {{ error?: string }} opts - Opções de falha (mensagem de erro opcional)
   * @returns {Promise<void>}
   */
  async fail(id: number, opts: { error?: string } = {}): Promise<void> {
    // Primeiro lê attempts + max_attempts para decidir retry vs DLQ.
    const { rows } = await this.pool.query<Pick<JobRow, 'attempts' | 'max_attempts'>>(
      'SELECT attempts, max_attempts FROM clothos_core.jobs WHERE id = $1',
      [id],
    );

    const row = rows[0];
    if (!row) {
      logger.warn({ jobId: id }, 'JobRepository.fail: job não encontrado');
      return;
    }

    const { attempts, max_attempts } = row;

    if (attempts < max_attempts) {
      const delaySec = backoffSeconds(attempts);
      logger.info(
        { jobId: id, attempts, delaySec },
        'JobRepository.fail: agendando retry com backoff',
      );
      await this.pool.query(
        `UPDATE clothos_core.jobs
            SET status       = 'pending',
                available_at = now() + ($1 || ' seconds')::interval,
                updated_at   = now()
          WHERE id = $2`,
        [String(delaySec), id],
      );
    } else {
      logger.warn(
        { jobId: id, attempts, error: opts.error },
        'JobRepository.fail: max_attempts atingido — movendo para DLQ (status=failed)',
      );
      await this.pool.query(
        `UPDATE clothos_core.jobs
            SET status     = 'failed',
                result     = COALESCE(result, $2::jsonb),
                updated_at = now()
          WHERE id = $1`,
        [id, JSON.stringify({ failure_reason: opts.error ?? 'unknown' })],
      );
    }
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
      `SELECT count(*) AS count FROM clothos_core.jobs
        WHERE status = 'pending' AND queue = $1`,
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
      `SELECT * FROM clothos_core.jobs
        WHERE status = 'failed' AND attempts >= max_attempts
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
      `UPDATE clothos_core.jobs
          SET status       = 'pending',
              attempts     = 0,
              available_at = now(),
              updated_at   = now()
        WHERE id = $1`,
      [id],
    );
  }
}
