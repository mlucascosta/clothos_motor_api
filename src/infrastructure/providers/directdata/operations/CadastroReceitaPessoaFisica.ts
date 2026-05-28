/**
 * @fileoverview Operation CadastroReceitaPessoaFisica — DirectData Marketplace API.
 * Endpoint para realizar a consulta Cadastro + Receita Federal - Pessoa Física.
 * @module infrastructure/providers/directdata/operations/CadastroReceitaPessoaFisica
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroReceitaPessoaFisica`.
 *
 * @class CadastroReceitaPessoaFisica
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroReceitaPessoaFisica extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroReceitaPessoaFisica';
}
