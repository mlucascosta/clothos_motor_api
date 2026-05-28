/**
 * @fileoverview Operation GarantiaSafra — DirectData Marketplace API.
 * Endpoint para realizar a consulta Garantia Safra. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/GarantiaSafra
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `GarantiaSafra`.
 *
 * @class GarantiaSafra
 * @extends {AbstractDirectDataOperation}
 */
export class GarantiaSafra extends AbstractDirectDataOperation {
  readonly path = '/api/GarantiaSafra';
}
