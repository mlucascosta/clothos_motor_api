/**
 * @fileoverview Port para operation RenapoMexico.
 * @module infrastructure/providers/directdata/ports/IRenapoMexico
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { RenapoMexicoRetornoDto } from '../dtos/RenapoMexicoDto.js';

/**
 * Interface para consulta de RenapoMexico.
 *
 * @interface IRenapoMexico
 */
export interface IRenapoMexico {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: RenapoMexicoRetornoDto | null;
  }>>;
}
