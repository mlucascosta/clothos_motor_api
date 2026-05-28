/**
 * @fileoverview Operation ReceitaFederalPessoaFisica — DirectData Marketplace API.
 * Endpoint para realizar a consulta Receita Federal - Pessoa Física.
 * @module infrastructure/providers/directdata/operations/ReceitaFederalPessoaFisica
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ReceitaFederalPessoaFisica`.
 *
 * @class ReceitaFederalPessoaFisica
 * @extends {AbstractDirectDataOperation}
 */
export class ReceitaFederalPessoaFisica extends AbstractDirectDataOperation {
  readonly path = '/api/ReceitaFederalPessoaFisica';
}
