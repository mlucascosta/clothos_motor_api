/**
 * @fileoverview Port para operation CertidaoNegativaDebitosMunicipal.
 * @module infrastructure/providers/directdata/ports/ICertidaoNegativaDebitosMunicipal
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CertidaoNegativaDebitosMunicipalRetornoDto } from '../dtos/CertidaoNegativaDebitosMunicipalDto.js';

/**
 * Interface para consulta de CertidaoNegativaDebitosMunicipal.
 *
 * @interface ICertidaoNegativaDebitosMunicipal
 */
export interface ICertidaoNegativaDebitosMunicipal {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CertidaoNegativaDebitosMunicipalRetornoDto | null;
  }>>;
}
