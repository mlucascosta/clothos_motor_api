/**
 * @fileoverview Operation ProcessosJudiciaisAgrupada — DirectData Marketplace API.
 * Endpoint para realizar a consulta Processos Judiciais - Agrupada (Base). Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/ProcessosJudiciaisAgrupada
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ProcessosJudiciaisAgrupada`.
 *
 * @class ProcessosJudiciaisAgrupada
 * @extends {AbstractDirectDataOperation}
 */
export class ProcessosJudiciaisAgrupada extends AbstractDirectDataOperation {
  readonly path = '/api/ProcessosJudiciaisAgrupada';
}
