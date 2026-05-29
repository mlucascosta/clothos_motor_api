/**
 * @fileoverview Port para operation ProtestosSP.
 * @module infrastructure/providers/directdata/ports/IProtestosSP
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { ProtestosSPRetornoDto } from '../dtos/ProtestosSPDto.js';

/**
 * Interface para consulta de ProtestosSP.
 *
 * @interface IProtestosSP
 */
export interface IProtestosSP {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: ProtestosSPRetornoDto | null;
  }>>;
}
