/**
 * @fileoverview Operation ANTTConsultaRegularidadeTransportadora — DirectData Marketplace API.
 * Endpoint para realizar a consulta ANTT - Consulta de Regularidade da Transportadora.
 * @module infrastructure/providers/directdata/operations/ANTTConsultaRegularidadeTransportadora
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ANTTConsultaRegularidadeTransportadora`.
 *
 * @class ANTTConsultaRegularidadeTransportadora
 * @extends {AbstractDirectDataOperation}
 */
export class ANTTConsultaRegularidadeTransportadora extends AbstractDirectDataOperation {
  readonly path = '/api/ANTTConsultaRegularidadeTransportadora';
}
