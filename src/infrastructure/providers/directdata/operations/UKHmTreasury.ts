/**
 * @fileoverview Operation UKHmTreasury — DirectData Marketplace API.
 * Endpoint para realizar a consulta UK Hm Treasury - Financial Sanctions. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/UKHmTreasury
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `UKHmTreasury`.
 *
 * @class UKHmTreasury
 * @extends {AbstractDirectDataOperation}
 */
export class UKHmTreasury extends AbstractDirectDataOperation {
  readonly path = '/api/UKHmTreasury';
}
