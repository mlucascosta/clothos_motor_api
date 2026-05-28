/**
 * @fileoverview Port para operation SintegraCCC.
 * @module infrastructure/providers/directdata/ports/ISintegraCCC
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SintegraCCCRetornoDto } from '../dtos/SintegraCCCDto.js';

/**
 * Interface para consulta de SintegraCCC.
 *
 * @interface ISintegraCCC
 */
export interface ISintegraCCC {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: SintegraCCCRetornoDto | null;
  }>>;
}
