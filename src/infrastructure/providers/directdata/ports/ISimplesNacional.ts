/**
 * @fileoverview Port para operation SimplesNacional.
 * @module infrastructure/providers/directdata/ports/ISimplesNacional
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SimplesNacionalRetornoDto } from '../dtos/SimplesNacionalDto.js';

/**
 * Interface para consulta de SimplesNacional.
 *
 * @interface ISimplesNacional
 */
export interface ISimplesNacional {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: SimplesNacionalRetornoDto | null;
  }>>;
}
