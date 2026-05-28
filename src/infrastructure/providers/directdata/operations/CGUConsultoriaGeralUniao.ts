/**
 * @fileoverview Operation CGUConsultoriaGeralUniao — DirectData Marketplace API.
 * Endpoint para realizar a consulta Consultoria Geral da União - CGU.
 * @module infrastructure/providers/directdata/operations/CGUConsultoriaGeralUniao
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CGUConsultoriaGeralUniao`.
 *
 * @class CGUConsultoriaGeralUniao
 * @extends {AbstractDirectDataOperation}
 */
export class CGUConsultoriaGeralUniao extends AbstractDirectDataOperation {
  readonly path = '/api/CGUConsultoriaGeralUniao';
}
