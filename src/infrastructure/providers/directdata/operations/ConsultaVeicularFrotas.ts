/**
 * @fileoverview Operation ConsultaVeicularFrotas — DirectData Marketplace API.
 * Endpoint para realizar a consulta Consulta Veicular - Frotas PF e PJ. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/ConsultaVeicularFrotas
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ConsultaVeicularFrotas`.
 *
 * @class ConsultaVeicularFrotas
 * @extends {AbstractDirectDataOperation}
 */
export class ConsultaVeicularFrotas extends AbstractDirectDataOperation {
  readonly path = '/api/ConsultaVeicularFrotas';
}
