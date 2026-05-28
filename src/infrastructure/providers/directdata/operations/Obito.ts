/**
 * @fileoverview Operation Obito — DirectData Marketplace API.
 * Endpoint para realizar a consulta Óbito. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/Obito
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `Obito`.
 *
 * @class Obito
 * @extends {AbstractDirectDataOperation}
 */
export class Obito extends AbstractDirectDataOperation {
  readonly path = '/api/Obito';
}
