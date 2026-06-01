/**
 * @fileoverview Port para operation AuxilioReconstrucao.
 * @module infrastructure/providers/directdata/ports/IAuxilioReconstrucao
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { AuxilioReconstrucaoRetornoDto } from '../dtos/AuxilioReconstrucaoDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de AuxilioReconstrucao.
 *
 * @interface IAuxilioReconstrucao
 */
export interface IAuxilioReconstrucao {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: AuxilioReconstrucaoRetornoDto | null;
      }
    >
  >;
}
