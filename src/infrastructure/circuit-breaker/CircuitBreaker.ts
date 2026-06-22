/**
 * @fileoverview Circuit Breaker com estado em clothos_core.providers (JSONB).
 *
 * Estado armazenado na coluna `circuit_breaker_state` JSONB de `clothos_core.providers`:
 *   { state: 'closed'|'open'|'half_open', opened_at: number, failures: number[] }
 *
 * onde `failures` é um array de epoch_ms filtrado por janela deslizante em código.
 *
 * Atomicidade via `pg_advisory_xact_lock(hashtext('circuit:'+slug))` + transação,
 * substituindo a atomicidade de comandos Redis (SETNX/INCRBY) sem redis adicional.
 *
 * Keying por `providerSlug` (compartilhado) — o motor NÃO é multi-tenant (ADR-0019):
 * o estado do circuito é por provider, não por tenant.
 *
 * @see PHASE_23_SPEC §8.6
 * @module infrastructure/circuit-breaker/CircuitBreaker
 */

import { logger } from '@shared/infrastructure/logger.js';
import type { Pool, PoolClient } from 'pg';

// ---------------------------------------------------------------------------
// Defaults nomeados (sobrescrevíveis via construtor)
// ---------------------------------------------------------------------------

/** Número de falhas na janela para abrir o circuito. */
const DEFAULT_THRESHOLD = 5;
/** Largura da janela deslizante em segundos. */
const DEFAULT_WINDOW_SEC = 300;
/** Tempo que o circuito permanece aberto antes de transitar para half_open. */
const DEFAULT_OPEN_DURATION_SEC = 300;

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

/**
 * Forma do JSONB armazenado em clothos_core.providers.circuit_breaker_state.
 */
interface CircuitState {
  /** Estado atual do circuito. */
  state: 'closed' | 'open' | 'half_open';
  /** Epoch ms do momento em que o circuito foi aberto (0 se fechado). */
  opened_at: number;
  /** Array de epoch ms de falhas dentro da janela. */
  failures: number[];
}

/**
 * Configuração do circuit breaker.
 */
export interface CircuitBreakerConfig {
  /** Falhas dentro da janela para abrir o circuito (padrão: 5). */
  threshold: number;
  /** Largura da janela deslizante em segundos (padrão: 300). */
  windowSec: number;
  /** Duração do estado 'open' antes de transitar para 'half_open' (padrão: 300s). */
  openDurationSec: number;
}

// ---------------------------------------------------------------------------
// CircuitBreaker
// ---------------------------------------------------------------------------

/**
 * Circuit Breaker por provedor, com estado persistido em PostgreSQL.
 * Estado compartilhado entre workers — o motor não isola por tenant.
 *
 * @example
 * const cb = new CircuitBreaker(pool, 'escavador');
 * if (await cb.isOpen()) throw new Error('circuit open');
 * try {
 *   await callProvider();
 *   await cb.recordSuccess();
 * } catch (err) {
 *   await cb.recordFailure();
 *   throw err;
 * }
 */
export class CircuitBreaker {
  private readonly config: CircuitBreakerConfig;

  /**
   * @param {Pool} pool - Pool pg conectado a clothos_core
   * @param {string} providerSlug - Identificador do provider (PK em clothos_core.providers)
   * @param {Partial<CircuitBreakerConfig>} config - Sobrescreve defaults
   */
  constructor(
    private readonly pool: Pool,
    private readonly providerSlug: string,
    config: Partial<CircuitBreakerConfig> = {},
  ) {
    this.config = {
      threshold: config.threshold ?? DEFAULT_THRESHOLD,
      windowSec: config.windowSec ?? DEFAULT_WINDOW_SEC,
      openDurationSec: config.openDurationSec ?? DEFAULT_OPEN_DURATION_SEC,
    };
  }

  // -------------------------------------------------------------------------
  // Acesso interno ao estado
  // -------------------------------------------------------------------------

  /**
   * Lê o estado atual do circuit breaker do banco.
   * Não usa lock — apenas leitura. Para escrita, use o método transacional.
   *
   * @private
   */
  private async readState(): Promise<CircuitState> {
    const { rows } = await this.pool.query<{ s: Partial<CircuitState> | null }>(
      'SELECT circuit_breaker_state AS s FROM clothos_core.providers WHERE slug = $1',
      [this.providerSlug],
    );
    const raw: Partial<CircuitState> = rows[0]?.s ?? {};
    return {
      state: raw.state ?? 'closed',
      opened_at: raw.opened_at ?? 0,
      failures: Array.isArray(raw.failures) ? raw.failures : [],
    };
  }

  /**
   * Persiste o estado do circuit breaker (sem transação própria — use dentro de um client).
   *
   * @private
   * @param {PoolClient} client - Cliente já em transação
   * @param {CircuitState} state - Novo estado
   */
  private async writeStateInTx(client: PoolClient, state: CircuitState): Promise<void> {
    await client.query(
      `UPDATE clothos_core.providers
          SET circuit_breaker_state = $2, updated_at = now()
        WHERE slug = $1`,
      [this.providerSlug, JSON.stringify(state)],
    );
  }

  // -------------------------------------------------------------------------
  // API pública
  // -------------------------------------------------------------------------

  /**
   * Verifica se o circuito está aberto (requests devem ser bloqueados).
   *
   * Transição automática open→half_open quando `openDurationSec` expirou.
   * half_open permite uma tentativa de sondagem — se bem-sucedida, `recordSuccess`
   * fecha o circuito; se falha, `recordFailure` reabre.
   *
   * @returns {Promise<boolean>} true se bloqueado (aberto), false caso contrário
   */
  async isOpen(): Promise<boolean> {
    const s = await this.readState();

    if (s.state !== 'open') return false;

    const elapsedMs = Date.now() - s.opened_at;
    if (elapsedMs > this.config.openDurationSec * 1000) {
      // Transita para half_open para permitir sondagem
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
          `circuit:${this.providerSlug}`,
        ]);
        const fresh = await this.readState();
        if (fresh.state === 'open') {
          await this.writeStateInTx(client, { ...fresh, state: 'half_open' });
        }
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        logger.error(
          { err, providerSlug: this.providerSlug },
          'CircuitBreaker.isOpen: erro ao transitar para half_open',
        );
      } finally {
        client.release();
      }
      return false;
    }

    return true;
  }

  /**
   * Registra uma falha no provider.
   *
   * Usa `pg_advisory_xact_lock(hashtext('circuit:'+slug))` + transação para garantir
   * exclusão mútua entre workers sem Redis (substitui INCRBY/SETNX Redis — ADR-0019).
   *
   * Janela deslizante implementada filtrando o array `failures` em código
   * (ts > now - windowSec*1000) após adicionar o novo timestamp.
   *
   * @returns {Promise<void>}
   */
  async recordFailure(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `circuit:${this.providerSlug}`,
      ]);

      const now = Date.now();
      const s = await this.readState();
      const windowMs = this.config.windowSec * 1000;
      const failures = [...s.failures, now].filter((ts) => ts > now - windowMs);

      const next: CircuitState =
        failures.length >= this.config.threshold
          ? { state: 'open', opened_at: now, failures }
          : { state: s.state, opened_at: s.opened_at, failures };

      await this.writeStateInTx(client, next);
      await client.query('COMMIT');

      if (next.state === 'open' && s.state !== 'open') {
        logger.warn(
          { providerSlug: this.providerSlug, failures: failures.length },
          'CircuitBreaker: circuito aberto',
        );
      }
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Registra sucesso no provider.
   *
   * Se estiver em half_open, fecha o circuito (reset total de failures).
   * Em closed/open, não faz nada — falhas passadas expiram naturalmente pela janela deslizante.
   *
   * @returns {Promise<void>}
   */
  async recordSuccess(): Promise<void> {
    const s = await this.readState();
    if (s.state !== 'half_open') return;

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
        `circuit:${this.providerSlug}`,
      ]);
      const fresh = await this.readState();
      if (fresh.state === 'half_open') {
        await this.writeStateInTx(client, { state: 'closed', opened_at: 0, failures: [] });
        logger.info(
          { providerSlug: this.providerSlug },
          'CircuitBreaker: circuito fechado após half_open',
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
