/**
 * @fileoverview Operation RenapoMexico — DirectData Marketplace API.
 * Endpoint para realizar a consulta Registro Nacional de Población - CURP - México.
 * @module infrastructure/providers/directdata/operations/RenapoMexico
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `RenapoMexico`.
 *
 * @class RenapoMexico
 * @extends {AbstractDirectDataOperation}
 */
export class RenapoMexico extends AbstractDirectDataOperation {
  readonly path = '/api/RenapoMexico';
}
