/**
 * @fileoverview Port para operation Similarity.
 * @module infrastructure/providers/directdata/ports/ISimilarity
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SimilarityRetornoDto } from '../dtos/SimilarityDto.js';

/**
 * Interface para consulta de Similarity.
 *
 * @interface ISimilarity
 */
export interface ISimilarity {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: SimilarityRetornoDto | null;
  }>>;
}
