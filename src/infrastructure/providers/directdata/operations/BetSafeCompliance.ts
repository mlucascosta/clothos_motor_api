/**
 * @fileoverview Operation BetSafeCompliance — DirectData Marketplace API.
 * Endpoint para realizar a consulta Bet Safe Compliance . Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/BetSafeCompliance
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `BetSafeCompliance`.
 *
 * @class BetSafeCompliance
 * @extends {AbstractDirectDataOperation}
 */
export class BetSafeCompliance extends AbstractDirectDataOperation {
  readonly path = '/api/BetSafeCompliance';
}
