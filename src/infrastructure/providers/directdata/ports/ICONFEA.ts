/**
 * @fileoverview Port para operation CONFEA.
 * @module infrastructure/providers/directdata/ports/ICONFEA
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CONFEARetornoDto } from '../dtos/CONFEADto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CONFEA.
 *
 * @interface ICONFEA
 */
export interface ICONFEA {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CONFEARetornoDto | null;
      }
    >
  >;
}
