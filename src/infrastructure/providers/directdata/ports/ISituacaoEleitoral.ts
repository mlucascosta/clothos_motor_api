/**
 * @fileoverview Port para operation SituacaoEleitoral.
 * @module infrastructure/providers/directdata/ports/ISituacaoEleitoral
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SituacaoEleitoralRetornoDto } from '../dtos/SituacaoEleitoralDto.js';

/**
 * Interface para consulta de SituacaoEleitoral.
 *
 * @interface ISituacaoEleitoral
 */
export interface ISituacaoEleitoral {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: SituacaoEleitoralRetornoDto | null;
  }>>;
}
