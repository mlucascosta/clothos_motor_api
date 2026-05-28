/**
 * @fileoverview Operation AuxilioEmergencial — DirectData Marketplace API.
 * Endpoint para realizar a consulta Auxílio Emergencial. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/AuxilioEmergencial
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `AuxilioEmergencial`.
 *
 * @class AuxilioEmergencial
 * @extends {AbstractDirectDataOperation}
 */
export class AuxilioEmergencial extends AbstractDirectDataOperation {
  readonly path = '/api/AuxilioEmergencial';
}
