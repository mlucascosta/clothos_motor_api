/**
 * @fileoverview Port para operation VinculoEmpregaticio.
 * @module infrastructure/providers/directdata/ports/IVinculoEmpregaticio
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { VinculoEmpregaticioRetornoDto } from '../dtos/VinculoEmpregaticioDto.js';

/**
 * Interface para consulta de VinculoEmpregaticio.
 *
 * @interface IVinculoEmpregaticio
 */
export interface IVinculoEmpregaticio {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: VinculoEmpregaticioRetornoDto | null;
      }
    >
  >;
}
