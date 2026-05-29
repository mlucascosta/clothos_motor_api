/**
 * @fileoverview Port para operation TituloLocalVotacao.
 * @module infrastructure/providers/directdata/ports/ITituloLocalVotacao
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { TituloLocalVotacaoRetornoDto } from '../dtos/TituloLocalVotacaoDto.js';

/**
 * Interface para consulta de TituloLocalVotacao.
 *
 * @interface ITituloLocalVotacao
 */
export interface ITituloLocalVotacao {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: TituloLocalVotacaoRetornoDto | null;
  }>>;
}
