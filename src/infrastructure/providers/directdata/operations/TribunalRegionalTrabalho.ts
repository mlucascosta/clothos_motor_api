/**
 * @fileoverview Operation TribunalRegionalTrabalho — DirectData Marketplace API.
 * Endpoint para realizar a consulta TRT - Tribunal Regional do Trabalho.
 * @module infrastructure/providers/directdata/operations/TribunalRegionalTrabalho
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `TribunalRegionalTrabalho`.
 *
 * @class TribunalRegionalTrabalho
 * @extends {AbstractDirectDataOperation}
 */
export class TribunalRegionalTrabalho extends AbstractDirectDataOperation {
  readonly path = '/api/TribunalRegionalTrabalho';
}
