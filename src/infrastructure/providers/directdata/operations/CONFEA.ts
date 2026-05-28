/**
 * @fileoverview Operation CONFEA — DirectData Marketplace API.
 * Endpoint para realizar a consulta CONFEA/CREA - Conselho Federal de Engenharia e Agronomia.
 * @module infrastructure/providers/directdata/operations/CONFEA
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CONFEA`.
 *
 * @class CONFEA
 * @extends {AbstractDirectDataOperation}
 */
export class CONFEA extends AbstractDirectDataOperation {
  readonly path = '/api/CONFEA';
}
