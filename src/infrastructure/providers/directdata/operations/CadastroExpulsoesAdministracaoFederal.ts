/**
 * @fileoverview Operation CadastroExpulsoesAdministracaoFederal — DirectData Marketplace API.
 * Endpoint para realizar a consulta CEAF - Cadastro de Expulsões da Administração Federal. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CadastroExpulsoesAdministracaoFederal
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroExpulsoesAdministracaoFederal`.
 *
 * @class CadastroExpulsoesAdministracaoFederal
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroExpulsoesAdministracaoFederal extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroExpulsoesAdministracaoFederal';
}
