/**
 * @fileoverview Operation SCRBacen — DirectData Marketplace API.
 * Endpoint para realizar a consulta SCR Analítico - Resumo BACEN. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/SCRBacen
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `SCRBacen`.
 *
 * @class SCRBacen
 * @extends {AbstractDirectDataOperation}
 */
export class SCRBacen extends AbstractDirectDataOperation {
  readonly path = '/api/SCRBacen';
}
