/**
 * @fileoverview Port para operation RegistrationDataBrazil.
 * @module infrastructure/providers/directdata/ports/IRegistrationDataBrazil
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { RegistrationDataBrazilRetornoDto } from '../dtos/RegistrationDataBrazilDto.js';

/**
 * Interface para consulta de RegistrationDataBrazil.
 *
 * @interface IRegistrationDataBrazil
 */
export interface IRegistrationDataBrazil {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: RegistrationDataBrazilRetornoDto | null;
  }>>;
}
