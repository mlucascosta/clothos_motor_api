/**
 * @fileoverview Operation MTEInfracoesTrabalhistas — DirectData Marketplace API.
 * Endpoint para realizar a consulta Ministério do Trabalho e do Emprego (MTE) - Infrações Trabalhistas.
 * @module infrastructure/providers/directdata/operations/MTEInfracoesTrabalhistas
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `MTEInfracoesTrabalhistas`.
 *
 * @class MTEInfracoesTrabalhistas
 * @extends {AbstractDirectDataOperation}
 */
export class MTEInfracoesTrabalhistas extends AbstractDirectDataOperation {
  readonly path = '/api/MTEInfracoesTrabalhistas';
}
