/**
 * @fileoverview Operation SeguroDefeso — DirectData Marketplace API.
 * Endpoint para realizar a consulta Seguro Defeso. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/SeguroDefeso
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `SeguroDefeso`.
 *
 * @class SeguroDefeso
 * @extends {AbstractDirectDataOperation}
 */
export class SeguroDefeso extends AbstractDirectDataOperation {
  readonly path = '/api/SeguroDefeso';
}
