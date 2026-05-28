/**
 * @fileoverview Operation Score — DirectData Marketplace API.
 * Endpoint para realizar a consulta Score de Crédito - QUOD. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/Score
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `Score`.
 *
 * @class Score
 * @extends {AbstractDirectDataOperation}
 */
export class Score extends AbstractDirectDataOperation {
  readonly path = '/api/Score';
}
