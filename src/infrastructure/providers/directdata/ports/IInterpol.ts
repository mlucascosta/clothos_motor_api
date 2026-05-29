/**
 * @fileoverview Port para operation Interpol.
 * @module infrastructure/providers/directdata/ports/IInterpol
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { InterpolRetornoDto } from '../dtos/InterpolDto.js';

/**
 * Interface para consulta de Interpol.
 *
 * @interface IInterpol
 */
export interface IInterpol {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: InterpolRetornoDto | null;
  }>>;
}
