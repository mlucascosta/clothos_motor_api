/**
 * @fileoverview Operation SimilarityArgentina — DirectData Marketplace API.
 * Endpoint para realizar a consulta Similarity - Argentina. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/SimilarityArgentina
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `SimilarityArgentina`.
 *
 * @class SimilarityArgentina
 * @extends {AbstractDirectDataOperation}
 */
export class SimilarityArgentina extends AbstractDirectDataOperation {
  readonly path = '/api/SimilarityArgentina';
}
