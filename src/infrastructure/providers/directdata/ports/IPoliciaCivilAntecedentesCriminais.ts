/**
 * @fileoverview Port para operation PoliciaCivilAntecedentesCriminais.
 * @module infrastructure/providers/directdata/ports/IPoliciaCivilAntecedentesCriminais
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { PoliciaCivilAntecedentesCriminaisRetornoDto } from '../dtos/PoliciaCivilAntecedentesCriminaisDto.js';

/**
 * Interface para consulta de PoliciaCivilAntecedentesCriminais.
 *
 * @interface IPoliciaCivilAntecedentesCriminais
 */
export interface IPoliciaCivilAntecedentesCriminais {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: PoliciaCivilAntecedentesCriminaisRetornoDto | null;
  }>>;
}
