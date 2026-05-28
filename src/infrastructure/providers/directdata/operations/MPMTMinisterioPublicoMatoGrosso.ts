/**
 * @fileoverview Operation MPMTMinisterioPublicoMatoGrosso — DirectData Marketplace API.
 * Endpoint para realizar a consulta Ministério Público do Estado de Mato Grosso (MPMT) - Procedimentos Investigatórios Extrajudiciais.
 * @module infrastructure/providers/directdata/operations/MPMTMinisterioPublicoMatoGrosso
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `MPMTMinisterioPublicoMatoGrosso`.
 *
 * @class MPMTMinisterioPublicoMatoGrosso
 * @extends {AbstractDirectDataOperation}
 */
export class MPMTMinisterioPublicoMatoGrosso extends AbstractDirectDataOperation {
  readonly path = '/api/MPMTMinisterioPublicoMatoGrosso';
}
