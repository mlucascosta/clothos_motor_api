/**
 * @fileoverview Operation ProcessosJudiciaisCompleta — DirectData Marketplace API.
 * Endpoint para realizar a consulta Processos Judiciais - Completa (Base). Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/ProcessosJudiciaisCompleta
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ProcessosJudiciaisCompleta`.
 *
 * @class ProcessosJudiciaisCompleta
 * @extends {AbstractDirectDataOperation}
 */
export class ProcessosJudiciaisCompleta extends AbstractDirectDataOperation {
  readonly path = '/api/ProcessosJudiciaisCompleta';
}
