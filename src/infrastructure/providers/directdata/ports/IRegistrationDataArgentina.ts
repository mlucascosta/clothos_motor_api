/**
 * @fileoverview Port para operation RegistrationDataArgentina.
 * @module infrastructure/providers/directdata/ports/IRegistrationDataArgentina
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { RegistrationDataArgentinaRetornoDto } from '../dtos/RegistrationDataArgentinaDto.js';

/**
 * Interface para consulta de RegistrationDataArgentina.
 *
 * @interface IRegistrationDataArgentina
 */
export interface IRegistrationDataArgentina {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: RegistrationDataArgentinaRetornoDto | null;
  }>>;
}
