/**
 * @fileoverview Operation ConsultaVeicularFipe — DirectData Marketplace API.
 * Endpoint para realizar a consulta Veículos - FIPE. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/ConsultaVeicularFipe
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ConsultaVeicularFipe`.
 *
 * @class ConsultaVeicularFipe
 * @extends {AbstractDirectDataOperation}
 */
export class ConsultaVeicularFipe extends AbstractDirectDataOperation {
  readonly path = '/api/ConsultaVeicularFipe';
}
