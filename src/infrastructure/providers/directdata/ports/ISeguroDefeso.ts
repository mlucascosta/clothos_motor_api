/**
 * @fileoverview Port para operation SeguroDefeso.
 * @module infrastructure/providers/directdata/ports/ISeguroDefeso
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SeguroDefesoRetornoDto } from '../dtos/SeguroDefesoDto.js';

/**
 * Interface para consulta de SeguroDefeso.
 *
 * @interface ISeguroDefeso
 */
export interface ISeguroDefeso {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: SeguroDefesoRetornoDto | null;
      }
    >
  >;
}
