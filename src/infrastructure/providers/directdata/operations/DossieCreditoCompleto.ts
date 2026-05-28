/**
 * @fileoverview Operation DossieCreditoCompleto — DirectData Marketplace API.
 * Endpoint para realizar a consulta Dossiê QUOD - Completo. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/DossieCreditoCompleto
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `DossieCreditoCompleto`.
 *
 * @class DossieCreditoCompleto
 * @extends {AbstractDirectDataOperation}
 */
export class DossieCreditoCompleto extends AbstractDirectDataOperation {
  readonly path = '/api/DossieCreditoCompleto';
}
