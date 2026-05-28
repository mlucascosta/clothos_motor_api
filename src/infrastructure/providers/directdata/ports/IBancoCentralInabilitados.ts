/**
 * @fileoverview Port para operation BancoCentralInabilitados.
 * @module infrastructure/providers/directdata/ports/IBancoCentralInabilitados
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { BancoCentralInabilitadosRetornoDto } from '../dtos/BancoCentralInabilitadosDto.js';

/**
 * Interface para consulta de BancoCentralInabilitados.
 *
 * @interface IBancoCentralInabilitados
 */
export interface IBancoCentralInabilitados {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: BancoCentralInabilitadosRetornoDto | null;
  }>>;
}
