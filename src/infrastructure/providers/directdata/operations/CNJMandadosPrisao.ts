/**
 * @fileoverview Operation CNJMandadosPrisao — DirectData Marketplace API.
 * Endpoint para realizar a consulta CNJ - Mandados de Prisão.
 * @module infrastructure/providers/directdata/operations/CNJMandadosPrisao
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CNJMandadosPrisao`.
 *
 * @class CNJMandadosPrisao
 * @extends {AbstractDirectDataOperation}
 */
export class CNJMandadosPrisao extends AbstractDirectDataOperation {
  readonly path = '/api/CNJMandadosPrisao';
}
