/**
 * @fileoverview Operation ProcessosJudiciaisSimplificada — DirectData Marketplace API.
 * Endpoint para realizar a consulta Processos Judiciais - Simplificada (Base). Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/ProcessosJudiciaisSimplificada
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ProcessosJudiciaisSimplificada`.
 *
 * @class ProcessosJudiciaisSimplificada
 * @extends {AbstractDirectDataOperation}
 */
export class ProcessosJudiciaisSimplificada extends AbstractDirectDataOperation {
  readonly path = '/api/ProcessosJudiciaisSimplificada';
}
