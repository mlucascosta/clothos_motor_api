/**
 * @fileoverview Port para operation PRFInfracoes.
 * @module infrastructure/providers/directdata/ports/IPRFInfracoes
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { PRFInfracoesRetornoDto } from '../dtos/PRFInfracoesDto.js';

/**
 * Interface para consulta de PRFInfracoes.
 *
 * @interface IPRFInfracoes
 */
export interface IPRFInfracoes {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: PRFInfracoesRetornoDto | null;
      }
    >
  >;
}
