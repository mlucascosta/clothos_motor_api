/**
 * @fileoverview Port para operation DetalhamentoNegativo.
 * @module infrastructure/providers/directdata/ports/IDetalhamentoNegativo
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { DetalhamentoNegativoRetornoDto } from '../dtos/DetalhamentoNegativoDto.js';

/**
 * Interface para consulta de DetalhamentoNegativo.
 *
 * @interface IDetalhamentoNegativo
 */
export interface IDetalhamentoNegativo {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: DetalhamentoNegativoRetornoDto | null;
  }>>;
}
