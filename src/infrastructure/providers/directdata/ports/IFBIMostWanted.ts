/**
 * @fileoverview Port para operation FBIMostWanted.
 * @module infrastructure/providers/directdata/ports/IFBIMostWanted
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { FBIMostWantedRetornoDto } from '../dtos/FBIMostWantedDto.js';

/**
 * Interface para consulta de FBIMostWanted.
 *
 * @interface IFBIMostWanted
 */
export interface IFBIMostWanted {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: FBIMostWantedRetornoDto | null;
  }>>;
}
