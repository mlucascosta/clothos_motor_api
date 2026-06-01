/**
 * @fileoverview Port para operation SuframaCNPJ.
 * @module infrastructure/providers/directdata/ports/ISuframaCNPJ
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SuframaCNPJRetornoDto } from '../dtos/SuframaCNPJDto.js';

/**
 * Interface para consulta de SuframaCNPJ.
 *
 * @interface ISuframaCNPJ
 */
export interface ISuframaCNPJ {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: SuframaCNPJRetornoDto | null;
      }
    >
  >;
}
