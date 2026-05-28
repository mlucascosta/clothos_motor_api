/**
 * @fileoverview Operation AntifraudePix — DirectData Marketplace API.
 * Endpoint para realizar a consulta Antifraude Chave PIX. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/AntifraudePix
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `AntifraudePix`.
 *
 * @class AntifraudePix
 * @extends {AbstractDirectDataOperation}
 */
export class AntifraudePix extends AbstractDirectDataOperation {
  readonly path = '/api/AntifraudePix';
}
