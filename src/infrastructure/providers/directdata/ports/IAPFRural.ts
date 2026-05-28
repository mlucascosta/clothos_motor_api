/**
 * @fileoverview Port para operation APFRural.
 * @module infrastructure/providers/directdata/ports/IAPFRural
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { APFRuralRetornoDto } from '../dtos/APFRuralDto.js';

/**
 * Interface para consulta de APFRural.
 *
 * @interface IAPFRural
 */
export interface IAPFRural {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: APFRuralRetornoDto | null;
  }>>;
}
