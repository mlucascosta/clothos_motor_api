/**
 * @fileoverview Operation ProtestosOnline — DirectData Marketplace API.
 * Endpoint para realizar a consulta Protestos Nacional - IEPTB Online. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/ProtestosOnline
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ProtestosOnline`.
 *
 * @class ProtestosOnline
 * @extends {AbstractDirectDataOperation}
 */
export class ProtestosOnline extends AbstractDirectDataOperation {
  readonly path = '/api/ProtestosOnline';
}
