/**
 * @fileoverview Contrato para persistência de resultados brutos de provedores.
 * @module infrastructure/persistence/IRawResultStore
 */

import type { RawResultDoc } from './RawResultDoc.js';

/**
 * Interface para store de resultados brutos.
 * Permite substituição e mock em testes sem dependência de MongoDB.
 *
 * @interface IRawResultStore
 */
export interface IRawResultStore {
  /**
   * Persiste documento de resultado bruto.
   * Implementações podem ser fire-and-forget.
   *
   * @param {RawResultDoc} doc - Documento a persistir
   */
  save(doc: RawResultDoc): void;
}
