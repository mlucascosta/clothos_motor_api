/**
 * @fileoverview Operation SimilarityMexico — DirectData Marketplace API.
 * Endpoint para realizar a consulta Similarity - México. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/SimilarityMexico
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `SimilarityMexico`.
 *
 * @class SimilarityMexico
 * @extends {AbstractDirectDataOperation}
 */
export class SimilarityMexico extends AbstractDirectDataOperation {
  readonly path = '/api/SimilarityMexico';
}
