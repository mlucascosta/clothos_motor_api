/**
 * @fileoverview Port para operation GarantiaSafra.
 * @module infrastructure/providers/directdata/ports/IGarantiaSafra
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { GarantiaSafraRetornoDto } from '../dtos/GarantiaSafraDto.js';

/**
 * Interface para consulta de GarantiaSafra.
 *
 * @interface IGarantiaSafra
 */
export interface IGarantiaSafra {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: GarantiaSafraRetornoDto | null;
  }>>;
}
