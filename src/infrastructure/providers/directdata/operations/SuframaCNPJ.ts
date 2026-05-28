/**
 * @fileoverview Operation SuframaCNPJ — DirectData Marketplace API.
 * Endpoint para realizar a consulta Suframa - CNPJ.
 * @module infrastructure/providers/directdata/operations/SuframaCNPJ
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `SuframaCNPJ`.
 *
 * @class SuframaCNPJ
 * @extends {AbstractDirectDataOperation}
 */
export class SuframaCNPJ extends AbstractDirectDataOperation {
  readonly path = '/api/SuframaCNPJ';
}
