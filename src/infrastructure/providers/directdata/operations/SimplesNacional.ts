/**
 * @fileoverview Operation SimplesNacional — DirectData Marketplace API.
 * Endpoint para realizar a consulta Simples Nacional.
 * @module infrastructure/providers/directdata/operations/SimplesNacional
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `SimplesNacional`.
 *
 * @class SimplesNacional
 * @extends {AbstractDirectDataOperation}
 */
export class SimplesNacional extends AbstractDirectDataOperation {
  readonly path = '/api/SimplesNacional';
}
