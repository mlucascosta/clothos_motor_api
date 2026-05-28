/**
 * @fileoverview Operation MinisterioTrabalhoPIS — DirectData Marketplace API.
 * Endpoint para realizar a consulta Ministério do Trabalho - PIS. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/MinisterioTrabalhoPIS
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `MinisterioTrabalhoPIS`.
 *
 * @class MinisterioTrabalhoPIS
 * @extends {AbstractDirectDataOperation}
 */
export class MinisterioTrabalhoPIS extends AbstractDirectDataOperation {
  readonly path = '/api/MinisterioTrabalhoPIS';
}
