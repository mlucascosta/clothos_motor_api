/**
 * @fileoverview Operation CadastroPessoaFisicaPlus — DirectData Marketplace API.
 * Endpoint para realizar a consulta Cadastro - Pessoa Física - Plus. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CadastroPessoaFisicaPlus
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroPessoaFisicaPlus`.
 *
 * @class CadastroPessoaFisicaPlus
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroPessoaFisicaPlus extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroPessoaFisicaPlus';
}
