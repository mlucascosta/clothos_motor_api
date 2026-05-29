/**
 * @fileoverview Port para operation ReceitaPJParticipacaoSocietaria.
 * @module infrastructure/providers/directdata/ports/IReceitaPJParticipacaoSocietaria
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { ReceitaPJParticipacaoSocietariaRetornoDto } from '../dtos/ReceitaPJParticipacaoSocietariaDto.js';

/**
 * Interface para consulta de ReceitaPJParticipacaoSocietaria.
 *
 * @interface IReceitaPJParticipacaoSocietaria
 */
export interface IReceitaPJParticipacaoSocietaria {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: ReceitaPJParticipacaoSocietariaRetornoDto | null;
  }>>;
}
