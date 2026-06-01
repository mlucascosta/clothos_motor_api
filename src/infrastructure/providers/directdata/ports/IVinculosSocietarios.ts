/**
 * @fileoverview Port para operation VinculosSocietarios.
 * @module infrastructure/providers/directdata/ports/IVinculosSocietarios
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { VinculosSocietariosRetornoDto } from '../dtos/VinculosSocietariosDto.js';

/**
 * Interface para consulta de VinculosSocietarios.
 *
 * @interface IVinculosSocietarios
 */
export interface IVinculosSocietarios {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: VinculosSocietariosRetornoDto | null;
      }
    >
  >;
}
