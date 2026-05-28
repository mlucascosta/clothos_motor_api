/**
 * @fileoverview Port para operation TribunalJustica.
 * @module infrastructure/providers/directdata/ports/ITribunalJustica
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { TribunalJusticaRetornoDto } from '../dtos/TribunalJusticaDto.js';

/**
 * Interface para consulta de TribunalJustica.
 *
 * @interface ITribunalJustica
 */
export interface ITribunalJustica {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: TribunalJusticaRetornoDto | null;
  }>>;
}
