/**
 * @fileoverview Operation CadastroPessoaJuridica — DirectData Marketplace API.
 * Endpoint para realizar a consulta Cadastro - Pessoa Jurídica - Básica. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CadastroPessoaJuridica
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroPessoaJuridica`.
 *
 * @class CadastroPessoaJuridica
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroPessoaJuridica extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroPessoaJuridica';
}
