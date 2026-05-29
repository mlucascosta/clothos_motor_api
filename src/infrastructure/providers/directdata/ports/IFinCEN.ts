/**
 * @fileoverview Port para operation FinCEN.
 * @module infrastructure/providers/directdata/ports/IFinCEN
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { FinCENRetornoDto } from '../dtos/FinCENDto.js';

/**
 * Interface para consulta de FinCEN.
 *
 * @interface IFinCEN
 */
export interface IFinCEN {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: FinCENRetornoDto | null;
  }>>;
}
