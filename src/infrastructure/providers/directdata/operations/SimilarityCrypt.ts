/**
 * @fileoverview Operation SimilarityCrypt — DirectData Marketplace API.
 * Endpoint para realizar a consulta de Similarity Crypt. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/SimilarityCrypt
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `Similarity/Crypt`.
 *
 * @class SimilarityCrypt
 * @extends {AbstractDirectDataOperation}
 */
export class SimilarityCrypt extends AbstractDirectDataOperation {
  readonly path = '/api/Similarity/Crypt';
}
