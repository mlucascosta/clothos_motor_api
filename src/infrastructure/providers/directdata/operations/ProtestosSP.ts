/**
 * @fileoverview Operation ProtestosSP — DirectData Marketplace API.
 * Endpoint para realizar a consulta Protestos - SP.
 * @module infrastructure/providers/directdata/operations/ProtestosSP
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ProtestosSP`.
 *
 * @class ProtestosSP
 * @extends {AbstractDirectDataOperation}
 */
export class ProtestosSP extends AbstractDirectDataOperation {
  readonly path = '/api/ProtestosSP';
}
