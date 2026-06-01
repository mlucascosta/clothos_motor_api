/**
 * @fileoverview Port para operation ConsultaVeicularFrotas.
 * @module infrastructure/providers/directdata/ports/IConsultaVeicularFrotas
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ConsultaVeicularFrotasRetornoDto } from '../dtos/ConsultaVeicularFrotasDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de ConsultaVeicularFrotas.
 *
 * @interface IConsultaVeicularFrotas
 */
export interface IConsultaVeicularFrotas {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: ConsultaVeicularFrotasRetornoDto | null;
      }
    >
  >;
}
