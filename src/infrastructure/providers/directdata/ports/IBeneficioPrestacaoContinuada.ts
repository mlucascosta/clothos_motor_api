/**
 * @fileoverview Port para operation BeneficioPrestacaoContinuada.
 * @module infrastructure/providers/directdata/ports/IBeneficioPrestacaoContinuada
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { BeneficioPrestacaoContinuadaRetornoDto } from '../dtos/BeneficioPrestacaoContinuadaDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de BeneficioPrestacaoContinuada.
 *
 * @interface IBeneficioPrestacaoContinuada
 */
export interface IBeneficioPrestacaoContinuada {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: BeneficioPrestacaoContinuadaRetornoDto | null;
      }
    >
  >;
}
