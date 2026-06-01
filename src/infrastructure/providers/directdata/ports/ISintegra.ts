/**
 * @fileoverview Port para operation Sintegra.
 * @module infrastructure/providers/directdata/ports/ISintegra
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SintegraRetornoDto } from '../dtos/SintegraDto.js';

/**
 * Interface para consulta de Sintegra.
 *
 * @interface ISintegra
 */
export interface ISintegra {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: SintegraRetornoDto | null;
      }
    >
  >;
}
