/**
 * @fileoverview Operation HistoricoVeiculos — DirectData Marketplace API.
 * Endpoint para realizar a consulta Histórico Veicular PF e PJ - São Paulo. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/HistoricoVeiculos
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `HistoricoVeiculos`.
 *
 * @class HistoricoVeiculos
 * @extends {AbstractDirectDataOperation}
 */
export class HistoricoVeiculos extends AbstractDirectDataOperation {
  readonly path = '/api/HistoricoVeiculos';
}
