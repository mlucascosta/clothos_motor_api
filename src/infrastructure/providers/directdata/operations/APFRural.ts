/**
 * @fileoverview Operation APFRural — DirectData Marketplace API.
 * Endpoint para realizar a consulta APF Rural - Autorização Provisória de Funcionamento Rural.
 * @module infrastructure/providers/directdata/operations/APFRural
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `APFRural`.
 *
 * @class APFRural
 * @extends {AbstractDirectDataOperation}
 */
export class APFRural extends AbstractDirectDataOperation {
  readonly path = '/api/APFRural';
}
