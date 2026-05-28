/**
 * @fileoverview Operation RegistrationDataArgentina — DirectData Marketplace API.
 * Endpoint para realizar a consulta Registration Data - Argentina. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/RegistrationDataArgentina
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `RegistrationDataArgentina`.
 *
 * @class RegistrationDataArgentina
 * @extends {AbstractDirectDataOperation}
 */
export class RegistrationDataArgentina extends AbstractDirectDataOperation {
  readonly path = '/api/RegistrationDataArgentina';
}
