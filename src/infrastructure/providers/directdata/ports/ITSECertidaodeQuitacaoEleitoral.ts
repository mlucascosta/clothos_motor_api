/**
 * @fileoverview Port para operation TSECertidaodeQuitacaoEleitoral.
 * @module infrastructure/providers/directdata/ports/ITSECertidaodeQuitacaoEleitoral
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { TSECertidaodeQuitacaoEleitoralRetornoDto } from '../dtos/TSECertidaodeQuitacaoEleitoralDto.js';

/**
 * Interface para consulta de TSECertidaodeQuitacaoEleitoral.
 *
 * @interface ITSECertidaodeQuitacaoEleitoral
 */
export interface ITSECertidaodeQuitacaoEleitoral {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: TSECertidaodeQuitacaoEleitoralRetornoDto | null;
  }>>;
}
