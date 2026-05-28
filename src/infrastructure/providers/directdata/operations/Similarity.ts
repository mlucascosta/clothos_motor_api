/**
 * @fileoverview Operation Similarity — DirectData Marketplace API.
 * Endpoint para realizar a consulta Similarity - Brazil. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/Similarity
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `Similarity`.
 *
 * @class Similarity
 * @extends {AbstractDirectDataOperation}
 */
export class Similarity extends AbstractDirectDataOperation {
  readonly path = '/api/Similarity';
}
