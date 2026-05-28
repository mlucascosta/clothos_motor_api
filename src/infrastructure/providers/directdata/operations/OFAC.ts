/**
 * @fileoverview Operation OFAC — DirectData Marketplace API.
 * Endpoint para realizar a consulta OFAC - Sanctions List (SND and Non-SDN). Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/OFAC
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `OFAC`.
 *
 * @class OFAC
 * @extends {AbstractDirectDataOperation}
 */
export class OFAC extends AbstractDirectDataOperation {
  readonly path = '/api/OFAC';
}
