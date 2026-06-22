/**
 * @fileoverview Persistência de referências de pesquisa em clothos_core.query_refs (PostgreSQL).
 * Substitui MongoQueryRefStore — parte da migração ADR-0019 (single-store PostgreSQL).
 *
 * `correlation_id` é UNIQUE na tabela; conflitos são silenciados via ON CONFLICT DO NOTHING
 * (idempotência natural). Operação fire-and-forget: erros logados, nunca propagados.
 * Se `getPool()` retornar null (banco não configurado), vira no-op silencioso.
 *
 * @module infrastructure/persistence/PgQueryRefStore
 */

import { getPool } from '@infrastructure/database/pool.js';
import { logger } from '@shared/infrastructure/logger.js';
import type { IQueryRefStore } from './IQueryRefStore.js';
import type { QueryRefDoc } from './QueryRefDoc.js';

/**
 * Store de referências de pesquisa em PostgreSQL (clothos_core.query_refs).
 *
 * @implements {IQueryRefStore}
 */
export class PgQueryRefStore implements IQueryRefStore {
  /**
   * Persiste referência de pesquisa vinculando correlationId ao tenant.
   * Operação fire-and-forget: retorna void imediatamente.
   *
   * Usa ON CONFLICT (correlation_id) DO NOTHING para idempotência
   * (duplicatas são silenciadas sem erro).
   *
   * @param {QueryRefDoc} ref - Referência com correlationId, tenantId, gateway, fonte
   * @returns {void}
   */
  save(ref: QueryRefDoc): void {
    const pool = getPool();
    if (!pool) return;

    pool
      .query(
        `INSERT INTO clothos_core.query_refs
           (correlation_id, tenant_id, gateway, fonte, created_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (correlation_id) DO NOTHING`,
        [ref.correlationId, ref.tenantId, ref.gateway, ref.fonte, ref.createdAt],
      )
      .catch((err: unknown) => {
        logger.error({ err, correlationId: ref.correlationId }, 'PgQueryRefStore: INSERT failed');
      });
  }
}
