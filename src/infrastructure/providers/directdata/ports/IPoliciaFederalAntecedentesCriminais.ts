/**
 * @fileoverview Port para operation PoliciaFederalAntecedentesCriminais.
 * @module infrastructure/providers/directdata/ports/IPoliciaFederalAntecedentesCriminais
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { PoliciaFederalAntecedentesCriminaisRetornoDto } from '../dtos/PoliciaFederalAntecedentesCriminaisDto.js';

/**
 * Interface para consulta de PoliciaFederalAntecedentesCriminais.
 *
 * @interface IPoliciaFederalAntecedentesCriminais
 */
export interface IPoliciaFederalAntecedentesCriminais {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: PoliciaFederalAntecedentesCriminaisRetornoDto | null;
  }>>;
}
