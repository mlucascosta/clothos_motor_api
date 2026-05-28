/**
 * @fileoverview Port para operation AuxilioEmergencial.
 * @module infrastructure/providers/directdata/ports/IAuxilioEmergencial
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { AuxilioEmergencialRetornoDto } from '../dtos/AuxilioEmergencialDto.js';

/**
 * Interface para consulta de AuxilioEmergencial.
 *
 * @interface IAuxilioEmergencial
 */
export interface IAuxilioEmergencial {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: AuxilioEmergencialRetornoDto | null;
  }>>;
}
