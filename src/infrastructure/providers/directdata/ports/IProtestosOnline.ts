/**
 * @fileoverview Port para operation ProtestosOnline.
 * @module infrastructure/providers/directdata/ports/IProtestosOnline
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { ProtestosOnlineRetornoDto } from '../dtos/ProtestosOnlineDto.js';

/**
 * Interface para consulta de ProtestosOnline.
 *
 * @interface IProtestosOnline
 */
export interface IProtestosOnline {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: ProtestosOnlineRetornoDto | null;
      }
    >
  >;
}
