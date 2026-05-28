/**
 * @fileoverview Operation CaixaRegularidadeEmpregadorFGTS — DirectData Marketplace API.
 * Endpoint para realizar a consulta FGTS - Regularidade do Empregador .
 * @module infrastructure/providers/directdata/operations/CaixaRegularidadeEmpregadorFGTS
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CaixaRegularidadeEmpregadorFGTS`.
 *
 * @class CaixaRegularidadeEmpregadorFGTS
 * @extends {AbstractDirectDataOperation}
 */
export class CaixaRegularidadeEmpregadorFGTS extends AbstractDirectDataOperation {
  readonly path = '/api/CaixaRegularidadeEmpregadorFGTS';
}
