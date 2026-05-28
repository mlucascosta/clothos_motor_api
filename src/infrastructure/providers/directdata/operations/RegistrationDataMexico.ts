/**
 * @fileoverview Operation RegistrationDataMexico — DirectData Marketplace API.
 * Endpoint para realizar a consulta Registration Data - México. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/RegistrationDataMexico
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `RegistrationDataMexico`.
 *
 * @class RegistrationDataMexico
 * @extends {AbstractDirectDataOperation}
 */
export class RegistrationDataMexico extends AbstractDirectDataOperation {
  readonly path = '/api/RegistrationDataMexico';
}
