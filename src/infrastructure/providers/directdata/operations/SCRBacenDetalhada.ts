/**
 * @fileoverview Operation SCRBacenDetalhada — DirectData Marketplace API.
 * Endpoint para realizar a consulta SCR Detalhada - Resumo BACEN.
 * @module infrastructure/providers/directdata/operations/SCRBacenDetalhada
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `SCRBacenDetalhada`.
 *
 * @class SCRBacenDetalhada
 * @extends {AbstractDirectDataOperation}
 */
export class SCRBacenDetalhada extends AbstractDirectDataOperation {
  readonly path = '/api/SCRBacenDetalhada';
}
