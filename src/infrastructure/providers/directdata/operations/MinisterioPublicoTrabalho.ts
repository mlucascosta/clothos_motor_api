/**
 * @fileoverview Operation MinisterioPublicoTrabalho — DirectData Marketplace API.
 * Endpoint para realizar a consulta MPT - Ministério Público do Trabalho .
 * @module infrastructure/providers/directdata/operations/MinisterioPublicoTrabalho
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `MinisterioPublicoTrabalho`.
 *
 * @class MinisterioPublicoTrabalho
 * @extends {AbstractDirectDataOperation}
 */
export class MinisterioPublicoTrabalho extends AbstractDirectDataOperation {
  readonly path = '/api/MinisterioPublicoTrabalho';
}
