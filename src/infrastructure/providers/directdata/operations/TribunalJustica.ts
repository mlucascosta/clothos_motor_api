/**
 * @fileoverview Operation TribunalJustica — DirectData Marketplace API.
 * Endpoint para realizar a consulta TJ - Tribunal de Justiça - Processos. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/TribunalJustica
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `TribunalJustica`.
 *
 * @class TribunalJustica
 * @extends {AbstractDirectDataOperation}
 */
export class TribunalJustica extends AbstractDirectDataOperation {
  readonly path = '/api/TribunalJustica';
}
