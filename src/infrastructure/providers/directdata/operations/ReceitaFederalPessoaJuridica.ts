/**
 * @fileoverview Operation ReceitaFederalPessoaJuridica — DirectData Marketplace API.
 * Endpoint para realizar a consulta Receita Federal - Pessoa Jurídica.
 * @module infrastructure/providers/directdata/operations/ReceitaFederalPessoaJuridica
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ReceitaFederalPessoaJuridica`.
 *
 * @class ReceitaFederalPessoaJuridica
 * @extends {AbstractDirectDataOperation}
 */
export class ReceitaFederalPessoaJuridica extends AbstractDirectDataOperation {
  readonly path = '/api/ReceitaFederalPessoaJuridica';
}
