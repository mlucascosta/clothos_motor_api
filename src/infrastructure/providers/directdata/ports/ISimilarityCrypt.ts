/**
 * @fileoverview Port para operation SimilarityCrypt.
 * @module infrastructure/providers/directdata/ports/ISimilarityCrypt
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SimilarityCryptRetornoDto } from '../dtos/SimilarityCryptDto.js';

/**
 * Interface para consulta de Similarity/Crypt.
 *
 * @interface ISimilarityCrypt
 */
export interface ISimilarityCrypt {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: SimilarityCryptRetornoDto | null;
      }
    >
  >;
}
