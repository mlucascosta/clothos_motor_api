/**
 * @fileoverview Port para operation TribunalRegionalTrabalho.
 * @module infrastructure/providers/directdata/ports/ITribunalRegionalTrabalho
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { TribunalRegionalTrabalhoRetornoDto } from '../dtos/TribunalRegionalTrabalhoDto.js';

/**
 * Interface para consulta de TribunalRegionalTrabalho.
 *
 * @interface ITribunalRegionalTrabalho
 */
export interface ITribunalRegionalTrabalho {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: TribunalRegionalTrabalhoRetornoDto | null;
  }>>;
}
