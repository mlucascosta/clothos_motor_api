/**
 * @fileoverview Operation PRFInfracoes — DirectData Marketplace API.
 * Endpoint para realizar a consulta Polícia Rodoviária Federal - Infrações. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/PRFInfracoes
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `PRFInfracoes`.
 *
 * @class PRFInfracoes
 * @extends {AbstractDirectDataOperation}
 */
export class PRFInfracoes extends AbstractDirectDataOperation {
  readonly path = '/api/PRFInfracoes';
}
