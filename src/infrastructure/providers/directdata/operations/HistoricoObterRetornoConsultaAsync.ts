/**
 * @fileoverview Operation HistoricoObterRetornoConsultaAsync — DirectData Marketplace API.
 * Endpoint para obter o resultado de uma consulta assíncrona efetuada.
 * @module infrastructure/providers/directdata/operations/HistoricoObterRetornoConsultaAsync
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `Historico/ObterRetornoConsultaAsync`.
 *
 * @class HistoricoObterRetornoConsultaAsync
 * @extends {AbstractDirectDataOperation}
 */
export class HistoricoObterRetornoConsultaAsync extends AbstractDirectDataOperation {
  readonly path = '/api/Historico/ObterRetornoConsultaAsync';
}
