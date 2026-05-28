/**
 * @fileoverview Port para operation CorreiosBuscaCEP.
 * @module infrastructure/providers/directdata/ports/ICorreiosBuscaCEP
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CorreiosBuscaCEPRetornoDto } from '../dtos/CorreiosBuscaCEPDto.js';

/**
 * Interface para consulta de CorreiosBuscaCEP.
 *
 * @interface ICorreiosBuscaCEP
 */
export interface ICorreiosBuscaCEP {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CorreiosBuscaCEPRetornoDto | null;
  }>>;
}
