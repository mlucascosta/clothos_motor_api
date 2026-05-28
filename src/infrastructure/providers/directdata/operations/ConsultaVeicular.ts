/**
 * @fileoverview Operation ConsultaVeicular — DirectData Marketplace API.
 * Endpoint para realizar a consulta Consulta Veicular . Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/ConsultaVeicular
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ConsultaVeicular`.
 *
 * @class ConsultaVeicular
 * @extends {AbstractDirectDataOperation}
 */
export class ConsultaVeicular extends AbstractDirectDataOperation {
  readonly path = '/api/ConsultaVeicular';
}
