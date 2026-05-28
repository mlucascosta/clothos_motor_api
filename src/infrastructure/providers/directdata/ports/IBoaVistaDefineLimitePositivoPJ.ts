/**
 * @fileoverview Port para operation BoaVistaDefineLimitePositivoPJ.
 * @module infrastructure/providers/directdata/ports/IBoaVistaDefineLimitePositivoPJ
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { BoaVistaDefineLimitePositivoPJRetornoDto } from '../dtos/BoaVistaDefineLimitePositivoPJDto.js';

/**
 * Interface para consulta de BoaVistaDefineLimitePositivoPJ.
 *
 * @interface IBoaVistaDefineLimitePositivoPJ
 */
export interface IBoaVistaDefineLimitePositivoPJ {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: BoaVistaDefineLimitePositivoPJRetornoDto | null;
  }>>;
}
