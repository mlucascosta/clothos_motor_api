/**
 * @fileoverview Operation FBIMostWanted — DirectData Marketplace API.
 * Endpoint para realizar a consulta FBI - Most Wanted. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/FBIMostWanted
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `FBIMostWanted`.
 *
 * @class FBIMostWanted
 * @extends {AbstractDirectDataOperation}
 */
export class FBIMostWanted extends AbstractDirectDataOperation {
  readonly path = '/api/FBIMostWanted';
}
