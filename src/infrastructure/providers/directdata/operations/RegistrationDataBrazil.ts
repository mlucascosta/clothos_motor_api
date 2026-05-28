/**
 * @fileoverview Operation RegistrationDataBrazil — DirectData Marketplace API.
 * Endpoint para realizar a consulta Registration Data - Brazil. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/RegistrationDataBrazil
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `RegistrationDataBrazil`.
 *
 * @class RegistrationDataBrazil
 * @extends {AbstractDirectDataOperation}
 */
export class RegistrationDataBrazil extends AbstractDirectDataOperation {
  readonly path = '/api/RegistrationDataBrazil';
}
