/**
 * @fileoverview Port para operation AntifraudePix.
 * @module infrastructure/providers/directdata/ports/IAntifraudePix
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { AntifraudePixRetornoDto } from '../dtos/AntifraudePixDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de AntifraudePix.
 *
 * @interface IAntifraudePix
 */
export interface IAntifraudePix {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: AntifraudePixRetornoDto | null;
      }
    >
  >;
}
