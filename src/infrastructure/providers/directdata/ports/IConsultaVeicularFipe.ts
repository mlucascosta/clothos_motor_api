/**
 * @fileoverview Port para operation ConsultaVeicularFipe.
 * @module infrastructure/providers/directdata/ports/IConsultaVeicularFipe
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ConsultaVeicularFipeRetornoDto } from '../dtos/ConsultaVeicularFipeDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de ConsultaVeicularFipe.
 *
 * @interface IConsultaVeicularFipe
 */
export interface IConsultaVeicularFipe {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: ConsultaVeicularFipeRetornoDto | null;
      }
    >
  >;
}
