/**
 * @fileoverview Port para operation CVMProcessosAdministrativosSancionadores.
 * @module infrastructure/providers/directdata/ports/ICVMProcessosAdministrativosSancionadores
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CVMProcessosAdministrativosSancionadoresRetornoDto } from '../dtos/CVMProcessosAdministrativosSancionadoresDto.js';

/**
 * Interface para consulta de CVMProcessosAdministrativosSancionadores.
 *
 * @interface ICVMProcessosAdministrativosSancionadores
 */
export interface ICVMProcessosAdministrativosSancionadores {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CVMProcessosAdministrativosSancionadoresRetornoDto | null;
  }>>;
}
