/**
 * @fileoverview Port para operation TCUCertidaoNegativaProcesso.
 * @module infrastructure/providers/directdata/ports/ITCUCertidaoNegativaProcesso
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { TCUCertidaoNegativaProcessoRetornoDto } from '../dtos/TCUCertidaoNegativaProcessoDto.js';

/**
 * Interface para consulta de TCUCertidaoNegativaProcesso.
 *
 * @interface ITCUCertidaoNegativaProcesso
 */
export interface ITCUCertidaoNegativaProcesso {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: TCUCertidaoNegativaProcessoRetornoDto | null;
      }
    >
  >;
}
