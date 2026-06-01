/**
 * @fileoverview Port para operation TSTCertidaoNegativaDebitosTrabalhistas.
 * @module infrastructure/providers/directdata/ports/ITSTCertidaoNegativaDebitosTrabalhistas
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { TSTCertidaoNegativaDebitosTrabalhistasRetornoDto } from '../dtos/TSTCertidaoNegativaDebitosTrabalhistasDto.js';

/**
 * Interface para consulta de TSTCertidaoNegativaDebitosTrabalhistas.
 *
 * @interface ITSTCertidaoNegativaDebitosTrabalhistas
 */
export interface ITSTCertidaoNegativaDebitosTrabalhistas {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: TSTCertidaoNegativaDebitosTrabalhistasRetornoDto | null;
      }
    >
  >;
}
