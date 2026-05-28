/**
 * @fileoverview Operation DetalhamentoNegativo — DirectData Marketplace API.
 * Endpoint para realizar a consulta Detalhamento Negativo QUOD. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/DetalhamentoNegativo
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `DetalhamentoNegativo`.
 *
 * @class DetalhamentoNegativo
 * @extends {AbstractDirectDataOperation}
 */
export class DetalhamentoNegativo extends AbstractDirectDataOperation {
  readonly path = '/api/DetalhamentoNegativo';
}
