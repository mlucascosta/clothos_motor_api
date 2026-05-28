/**
 * @fileoverview Operation CadastroPessoaFisica — DirectData Marketplace API.
 * Endpoint para realizar a consulta Cadastro - Pessoa Física - Básica. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CadastroPessoaFisica
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroPessoaFisica`.
 *
 * @class CadastroPessoaFisica
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroPessoaFisica extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroPessoaFisica';
}
