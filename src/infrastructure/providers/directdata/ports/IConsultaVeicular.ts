/**
 * @fileoverview Port para operation ConsultaVeicular.
 * @module infrastructure/providers/directdata/ports/IConsultaVeicular
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ConsultaVeicularRetornoDto } from '../dtos/ConsultaVeicularDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de ConsultaVeicular.
 *
 * @interface IConsultaVeicular
 */
export interface IConsultaVeicular {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: ConsultaVeicularRetornoDto | null;
      }
    >
  >;
}
