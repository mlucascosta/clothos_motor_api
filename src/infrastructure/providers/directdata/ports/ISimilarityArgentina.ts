/**
 * @fileoverview Port para operation SimilarityArgentina.
 * @module infrastructure/providers/directdata/ports/ISimilarityArgentina
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SimilarityArgentinaRetornoDto } from '../dtos/SimilarityArgentinaDto.js';

/**
 * Interface para consulta de SimilarityArgentina.
 *
 * @interface ISimilarityArgentina
 */
export interface ISimilarityArgentina {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: SimilarityArgentinaRetornoDto | null;
  }>>;
}
