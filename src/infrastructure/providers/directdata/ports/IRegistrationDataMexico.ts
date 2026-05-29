/**
 * @fileoverview Port para operation RegistrationDataMexico.
 * @module infrastructure/providers/directdata/ports/IRegistrationDataMexico
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { RegistrationDataMexicoRetornoDto } from '../dtos/RegistrationDataMexicoDto.js';

/**
 * Interface para consulta de RegistrationDataMexico.
 *
 * @interface IRegistrationDataMexico
 */
export interface IRegistrationDataMexico {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: RegistrationDataMexicoRetornoDto | null;
  }>>;
}
