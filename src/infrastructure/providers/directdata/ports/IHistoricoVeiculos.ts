/**
 * @fileoverview Port para operation HistoricoVeiculos.
 * @module infrastructure/providers/directdata/ports/IHistoricoVeiculos
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { HistoricoVeiculosRetornoDto } from '../dtos/HistoricoVeiculosDto.js';

/**
 * Interface para consulta de HistoricoVeiculos.
 *
 * @interface IHistoricoVeiculos
 */
export interface IHistoricoVeiculos {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: HistoricoVeiculosRetornoDto | null;
      }
    >
  >;
}
