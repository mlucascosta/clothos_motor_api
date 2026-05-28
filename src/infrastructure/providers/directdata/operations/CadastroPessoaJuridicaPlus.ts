/**
 * @fileoverview Operation CadastroPessoaJuridicaPlus — DirectData Marketplace API.
 * Endpoint para realizar a consulta Cadastro - Pessoa Jurídica - Plus. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CadastroPessoaJuridicaPlus
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroPessoaJuridicaPlus`.
 *
 * @class CadastroPessoaJuridicaPlus
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroPessoaJuridicaPlus extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroPessoaJuridicaPlus';
}
