/**
 * @fileoverview Port para operation AML.
 * @module infrastructure/providers/directdata/ports/IAML
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { AMLRetornoDto } from '../dtos/AMLDto.js';

/**
 * Interface para consulta de AML.
 *
 * @interface IAML
 */
export interface IAML {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: AMLRetornoDto | null;
  }>>;
}
