/**
 * @fileoverview Port para operation TribunalRegionalFederal.
 * @module infrastructure/providers/directdata/ports/ITribunalRegionalFederal
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { TribunalRegionalFederalRetornoDto } from '../dtos/TribunalRegionalFederalDto.js';

/**
 * Interface para consulta de TribunalRegionalFederal.
 *
 * @interface ITribunalRegionalFederal
 */
export interface ITribunalRegionalFederal {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: TribunalRegionalFederalRetornoDto | null;
  }>>;
}
