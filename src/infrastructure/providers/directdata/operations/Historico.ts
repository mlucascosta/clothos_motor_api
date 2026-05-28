/**
 * @fileoverview Operation Historico — DirectData Marketplace API.
 * Endpoint para recuperar o retorno de uma consulta efetuada.
 * @module infrastructure/providers/directdata/operations/Historico
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `Historico`.
 *
 * @class Historico
 * @extends {AbstractDirectDataOperation}
 */
export class Historico extends AbstractDirectDataOperation {
  readonly path = '/api/Historico';
}
