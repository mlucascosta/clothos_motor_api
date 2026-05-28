/**
 * @fileoverview Operation EUFinancialList — DirectData Marketplace API.
 * Endpoint para realizar a consulta EU Financial Sanctions List . Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/EUFinancialList
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `EUFinancialList`.
 *
 * @class EUFinancialList
 * @extends {AbstractDirectDataOperation}
 */
export class EUFinancialList extends AbstractDirectDataOperation {
  readonly path = '/api/EUFinancialList';
}
