/**
 * @fileoverview Operation Interpol — DirectData Marketplace API.
 * Endpoint para realizar a consulta INTERPOL. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/Interpol
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `Interpol`.
 *
 * @class Interpol
 * @extends {AbstractDirectDataOperation}
 */
export class Interpol extends AbstractDirectDataOperation {
  readonly path = '/api/Interpol';
}
