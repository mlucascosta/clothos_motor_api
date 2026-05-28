/**
 * @fileoverview Operation CadastroNacionalImprobidadeAdministrativa — DirectData Marketplace API.
 * Endpoint para realizar a consulta CNIA - Cadastro Nacional de Condenações Cíveis por Ato de Improbidade Administrativa e Inelegibilidade.
 * @module infrastructure/providers/directdata/operations/CadastroNacionalImprobidadeAdministrativa
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroNacionalImprobidadeAdministrativa`.
 *
 * @class CadastroNacionalImprobidadeAdministrativa
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroNacionalImprobidadeAdministrativa extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroNacionalImprobidadeAdministrativa';
}
