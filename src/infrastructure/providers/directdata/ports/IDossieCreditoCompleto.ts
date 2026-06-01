/**
 * @fileoverview Port para operation DossieCreditoCompleto.
 * @module infrastructure/providers/directdata/ports/IDossieCreditoCompleto
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { DossieCreditoCompletoRetornoDto } from '../dtos/DossieCreditoCompletoDto.js';

/**
 * Interface para consulta de DossieCreditoCompleto.
 *
 * @interface IDossieCreditoCompleto
 */
export interface IDossieCreditoCompleto {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: DossieCreditoCompletoRetornoDto | null;
      }
    >
  >;
}
