/**
 * @fileoverview Port para operation PETITrabalhoInfantil.
 * @module infrastructure/providers/directdata/ports/IPETITrabalhoInfantil
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { PETITrabalhoInfantilRetornoDto } from '../dtos/PETITrabalhoInfantilDto.js';

/**
 * Interface para consulta de PETITrabalhoInfantil.
 *
 * @interface IPETITrabalhoInfantil
 */
export interface IPETITrabalhoInfantil {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: PETITrabalhoInfantilRetornoDto | null;
      }
    >
  >;
}
