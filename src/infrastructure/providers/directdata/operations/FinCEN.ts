/**
 * @fileoverview Operation FinCEN — DirectData Marketplace API.
 * Endpoint para realizar a consulta FINCEN - Financial Crimes Enforcement Network.
 * @module infrastructure/providers/directdata/operations/FinCEN
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `FinCEN`.
 *
 * @class FinCEN
 * @extends {AbstractDirectDataOperation}
 */
export class FinCEN extends AbstractDirectDataOperation {
  readonly path = '/api/FinCEN';
}
