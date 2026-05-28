/**
 * @fileoverview Port para operation Obito.
 * @module infrastructure/providers/directdata/ports/IObito
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { ObitoRetornoDto } from '../dtos/ObitoDto.js';

/**
 * Interface para consulta de Obito.
 *
 * @interface IObito
 */
export interface IObito {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: ObitoRetornoDto | null;
  }>>;
}
