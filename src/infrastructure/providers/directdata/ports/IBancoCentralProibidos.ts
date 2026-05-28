/**
 * @fileoverview Port para operation BancoCentralProibidos.
 * @module infrastructure/providers/directdata/ports/IBancoCentralProibidos
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { BancoCentralProibidosRetornoDto } from '../dtos/BancoCentralProibidosDto.js';

/**
 * Interface para consulta de BancoCentralProibidos.
 *
 * @interface IBancoCentralProibidos
 */
export interface IBancoCentralProibidos {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: BancoCentralProibidosRetornoDto | null;
  }>>;
}
