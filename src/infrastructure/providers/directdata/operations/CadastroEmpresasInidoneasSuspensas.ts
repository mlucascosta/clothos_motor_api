/**
 * @fileoverview Operation CadastroEmpresasInidoneasSuspensas — DirectData Marketplace API.
 * Endpoint para realizar a consulta CEIS - Cadastro de Empresas Inidôneas e Suspensas. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CadastroEmpresasInidoneasSuspensas
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroEmpresasInidoneasSuspensas`.
 *
 * @class CadastroEmpresasInidoneasSuspensas
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroEmpresasInidoneasSuspensas extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroEmpresasInidoneasSuspensas';
}
