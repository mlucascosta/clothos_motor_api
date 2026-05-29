/**
 * @fileoverview Port para operation Historico.
 * @module infrastructure/providers/directdata/ports/IHistorico
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { HistoricoRetornoDto } from '../dtos/HistoricoDto.js';

/**
 * Interface para consulta de Historico.
 *
 * @interface IHistorico
 */
export interface IHistorico {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: HistoricoRetornoDto | null;
  }>>;
}
