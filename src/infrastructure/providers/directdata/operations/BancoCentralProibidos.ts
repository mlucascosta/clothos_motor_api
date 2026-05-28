/**
 * @fileoverview Operation BancoCentralProibidos — DirectData Marketplace API.
 * Endpoint para realizar a consulta Banco Central - Quadro Geral de Proibidos. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/BancoCentralProibidos
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `BancoCentralProibidos`.
 *
 * @class BancoCentralProibidos
 * @extends {AbstractDirectDataOperation}
 */
export class BancoCentralProibidos extends AbstractDirectDataOperation {
  readonly path = '/api/BancoCentralProibidos';
}
