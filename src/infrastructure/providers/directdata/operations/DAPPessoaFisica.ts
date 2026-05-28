/**
 * @fileoverview Operation DAPPessoaFisica — DirectData Marketplace API.
 * Endpoint para realizar a consulta DAP - Declaração de Aptidão ao Pronaf - Pessoa Física.
 * @module infrastructure/providers/directdata/operations/DAPPessoaFisica
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `DAPPessoaFisica`.
 *
 * @class DAPPessoaFisica
 * @extends {AbstractDirectDataOperation}
 */
export class DAPPessoaFisica extends AbstractDirectDataOperation {
  readonly path = '/api/DAPPessoaFisica';
}
