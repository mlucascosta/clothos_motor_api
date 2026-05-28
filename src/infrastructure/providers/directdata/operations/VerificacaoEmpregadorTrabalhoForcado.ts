/**
 * @fileoverview Operation VerificacaoEmpregadorTrabalhoForcado — DirectData Marketplace API.
 * Endpoint para realizar a consulta Verificação de Empregador - Trabalho Forçado. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/VerificacaoEmpregadorTrabalhoForcado
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `VerificacaoEmpregadorTrabalhoForcado`.
 *
 * @class VerificacaoEmpregadorTrabalhoForcado
 * @extends {AbstractDirectDataOperation}
 */
export class VerificacaoEmpregadorTrabalhoForcado extends AbstractDirectDataOperation {
  readonly path = '/api/VerificacaoEmpregadorTrabalhoForcado';
}
