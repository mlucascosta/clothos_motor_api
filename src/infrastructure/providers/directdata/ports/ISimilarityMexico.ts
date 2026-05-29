/**
 * @fileoverview Port para operation SimilarityMexico.
 * @module infrastructure/providers/directdata/ports/ISimilarityMexico
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SimilarityMexicoRetornoDto } from '../dtos/SimilarityMexicoDto.js';

/**
 * Interface para consulta de SimilarityMexico.
 *
 * @interface ISimilarityMexico
 */
export interface ISimilarityMexico {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: SimilarityMexicoRetornoDto | null;
  }>>;
}
