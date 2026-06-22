/**
 * @fileoverview Helper de truncate para isolamento entre testes.
 * TRUNCATE apenas tabelas de dados transacionais; preserva `providers` (seed).
 * Usa RESTART IDENTITY para zerar sequências de id e garantir determinismo.
 */

import type { Pool } from 'pg';

/**
 * Trunca as tabelas transacionais do motor, preservando o seed de providers.
 * Deve ser chamado em `beforeEach` nos testes que precisam de estado limpo.
 *
 * @param pool Pool pg conectado a clothos_core
 */
export async function truncateTables(pool: Pool): Promise<void> {
  await pool.query(`
    TRUNCATE TABLE
      clothos_core.jobs,
      clothos_core.jobs_history,
      clothos_core.raw_results,
      clothos_core.query_refs,
      clothos_core.cache
    RESTART IDENTITY CASCADE
  `);
}

/**
 * Reseta o estado do circuit breaker de um provider para 'closed'.
 * Usado pelos testes de CircuitBreaker para estado inicial determinístico.
 *
 * @param pool Pool pg conectado a clothos_core
 * @param slug Slug do provider
 */
export async function resetCircuitBreaker(pool: Pool, slug: string): Promise<void> {
  await pool.query(
    `UPDATE clothos_core.providers
        SET circuit_breaker_state = '{"state":"closed","opened_at":0,"failures":[]}'::jsonb,
            updated_at = now()
      WHERE slug = $1`,
    [slug],
  );
}
