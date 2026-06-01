/**
 * @fileoverview Port para operation MinisterioPublicoTrabalho.
 * @module infrastructure/providers/directdata/ports/IMinisterioPublicoTrabalho
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { MinisterioPublicoTrabalhoRetornoDto } from '../dtos/MinisterioPublicoTrabalhoDto.js';

/**
 * Interface para consulta de MinisterioPublicoTrabalho.
 *
 * @interface IMinisterioPublicoTrabalho
 */
export interface IMinisterioPublicoTrabalho {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: MinisterioPublicoTrabalhoRetornoDto | null;
      }
    >
  >;
}
