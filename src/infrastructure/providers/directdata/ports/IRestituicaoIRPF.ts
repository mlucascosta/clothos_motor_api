/**
 * @fileoverview Port para operation RestituicaoIRPF.
 * @module infrastructure/providers/directdata/ports/IRestituicaoIRPF
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { RestituicaoIRPFRetornoDto } from '../dtos/RestituicaoIRPFDto.js';

/**
 * Interface para consulta de RestituicaoIRPF.
 *
 * @interface IRestituicaoIRPF
 */
export interface IRestituicaoIRPF {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: RestituicaoIRPFRetornoDto | null;
      }
    >
  >;
}
