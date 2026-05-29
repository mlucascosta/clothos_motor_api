/**
 * @fileoverview Port para operation Score.
 * @module infrastructure/providers/directdata/ports/IScore
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { ScoreRetornoDto } from '../dtos/ScoreDto.js';

/**
 * Interface para consulta de Score.
 *
 * @interface IScore
 */
export interface IScore {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: ScoreRetornoDto | null;
  }>>;
}
