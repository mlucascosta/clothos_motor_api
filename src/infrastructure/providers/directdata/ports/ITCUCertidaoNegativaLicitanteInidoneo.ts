/**
 * @fileoverview Port para operation TCUCertidaoNegativaLicitanteInidoneo.
 * @module infrastructure/providers/directdata/ports/ITCUCertidaoNegativaLicitanteInidoneo
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { TCUCertidaoNegativaLicitanteInidoneoRetornoDto } from '../dtos/TCUCertidaoNegativaLicitanteInidoneoDto.js';

/**
 * Interface para consulta de TCUCertidaoNegativaLicitanteInidoneo.
 *
 * @interface ITCUCertidaoNegativaLicitanteInidoneo
 */
export interface ITCUCertidaoNegativaLicitanteInidoneo {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: TCUCertidaoNegativaLicitanteInidoneoRetornoDto | null;
  }>>;
}
