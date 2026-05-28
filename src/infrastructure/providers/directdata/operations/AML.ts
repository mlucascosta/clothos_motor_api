/**
 * @fileoverview Operation AML — DirectData Marketplace API.
 * Endpoint para realizar a consulta AML - Anti Money Laundering (Vínculos Societários). Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/AML
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `AML`.
 *
 * @class AML
 * @extends {AbstractDirectDataOperation}
 */
export class AML extends AbstractDirectDataOperation {
  readonly path = '/api/AML';
}
