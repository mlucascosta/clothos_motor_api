/**
 * @fileoverview Port para operation CNJMandadosPrisao.
 * @module infrastructure/providers/directdata/ports/ICNJMandadosPrisao
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CNJMandadosPrisaoRetornoDto } from '../dtos/CNJMandadosPrisaoDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CNJMandadosPrisao.
 *
 * @interface ICNJMandadosPrisao
 */
export interface ICNJMandadosPrisao {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CNJMandadosPrisaoRetornoDto | null;
      }
    >
  >;
}
