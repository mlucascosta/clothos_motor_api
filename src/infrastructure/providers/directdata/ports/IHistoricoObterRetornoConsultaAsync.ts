/**
 * @fileoverview Port para operation HistoricoObterRetornoConsultaAsync.
 * @module infrastructure/providers/directdata/ports/IHistoricoObterRetornoConsultaAsync
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { HistoricoObterRetornoConsultaAsyncRetornoDto } from '../dtos/HistoricoObterRetornoConsultaAsyncDto.js';

/**
 * Interface para consulta de Historico/ObterRetornoConsultaAsync.
 *
 * @interface IHistoricoObterRetornoConsultaAsync
 */
export interface IHistoricoObterRetornoConsultaAsync {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: HistoricoObterRetornoConsultaAsyncRetornoDto | null;
  }>>;
}
