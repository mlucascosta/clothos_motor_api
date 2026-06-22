/**
 * @fileoverview Persistência de resultados brutos em clothos_core.raw_results (PostgreSQL JSONB).
 * Substitui MongoRawResultStore — parte da migração ADR-0019 (single-store PostgreSQL).
 *
 * CPF é armazenado como hash SHA-256 (LGPD); CNPJ em texto claro (dado público).
 * Operação fire-and-forget: não bloqueia a rota; erros são logados, nunca propagados.
 * Se `getPool()` retornar null (banco não configurado), vira no-op silencioso —
 * preservando o comportamento do MongoRawResultStore em ambiente sem banco.
 *
 * @module infrastructure/persistence/PgRawResultStore
 */

import { getPool } from '@infrastructure/database/pool.js';
import { hashCpfIfNeeded } from '@shared/domain/privacy/hashCpf.js';
import { logger } from '@shared/infrastructure/logger.js';
import type { IRawResultStore } from './IRawResultStore.js';
import type { RawResultDoc } from './RawResultDoc.js';

/**
 * Store de resultados brutos em PostgreSQL (clothos_core.raw_results).
 *
 * @implements {IRawResultStore}
 */
export class PgRawResultStore implements IRawResultStore {
  /**
   * Persiste documento de resultado bruto em clothos_core.raw_results.
   * Operação fire-and-forget: retorna void imediatamente; a inserção ocorre em background.
   *
   * CPF é hash SHA-256 antes da persistência (LGPD).
   * JSONB é serializado via JSON.stringify.
   *
   * @param {RawResultDoc} doc - Documento a persistir
   * @returns {void}
   */
  save(doc: RawResultDoc): void {
    const pool = getPool();
    if (!pool) return;

    const safeDoc: RawResultDoc = {
      ...doc,
      param: hashCpfIfNeeded(doc.tipo_param, doc.param),
    };

    pool
      .query(
        `INSERT INTO clothos_core.raw_results
           (gateway, fonte, tipo_param, param, result, status, error_kind, correlation_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          safeDoc.gateway,
          safeDoc.fonte,
          safeDoc.tipo_param,
          safeDoc.param,
          JSON.stringify(safeDoc.result),
          safeDoc.status,
          safeDoc.error_kind ?? null,
          safeDoc.correlationId ?? null,
          safeDoc.created_at,
        ],
      )
      .catch((err: unknown) => {
        logger.error({ err }, 'PgRawResultStore: INSERT failed');
      });
  }
}
