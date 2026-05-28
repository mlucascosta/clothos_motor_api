/**
 * @fileoverview Operation CadastroNacionalEmpresasPunidas — DirectData Marketplace API.
 * Endpoint para realizar a consulta CNEP - Cadastro Nacional de Empresas Punidas. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CadastroNacionalEmpresasPunidas
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroNacionalEmpresasPunidas`.
 *
 * @class CadastroNacionalEmpresasPunidas
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroNacionalEmpresasPunidas extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroNacionalEmpresasPunidas';
}
