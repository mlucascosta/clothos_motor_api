/**
 * @fileoverview Port para operation MTEInfracoesTrabalhistas.
 * @module infrastructure/providers/directdata/ports/IMTEInfracoesTrabalhistas
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { MTEInfracoesTrabalhistasRetornoDto } from '../dtos/MTEInfracoesTrabalhistasDto.js';

/**
 * Interface para consulta de MTEInfracoesTrabalhistas.
 *
 * @interface IMTEInfracoesTrabalhistas
 */
export interface IMTEInfracoesTrabalhistas {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: MTEInfracoesTrabalhistasRetornoDto | null;
      }
    >
  >;
}
