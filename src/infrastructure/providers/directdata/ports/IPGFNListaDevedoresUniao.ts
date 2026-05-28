/**
 * @fileoverview Port para operation PGFNListaDevedoresUniao.
 * @module infrastructure/providers/directdata/ports/IPGFNListaDevedoresUniao
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { PGFNListaDevedoresUniaoRetornoDto } from '../dtos/PGFNListaDevedoresUniaoDto.js';

/**
 * Interface para consulta de PGFNListaDevedoresUniao.
 *
 * @interface IPGFNListaDevedoresUniao
 */
export interface IPGFNListaDevedoresUniao {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: PGFNListaDevedoresUniaoRetornoDto | null;
  }>>;
}
