/**
 * @fileoverview Contrato para persistência de referências de pesquisa por tenant.
 * @module infrastructure/persistence/IQueryRefStore
 */

import type { QueryRefDoc } from './QueryRefDoc.js';

/**
 * Interface para store de referências de pesquisa.
 * Permite substituição e mock em testes sem dependência direta de PostgreSQL.
 *
 * @interface IQueryRefStore
 */
export interface IQueryRefStore {
  /**
   * Persiste referência de pesquisa vinculando correlationId ao tenant.
   * Implementações podem ser fire-and-forget.
   *
   * @param {QueryRefDoc} ref - Referência a persistir
   */
  save(ref: QueryRefDoc): void;
}
