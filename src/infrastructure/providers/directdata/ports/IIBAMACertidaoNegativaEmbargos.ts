/**
 * @fileoverview Port para operation IBAMACertidaoNegativaEmbargos.
 * @module infrastructure/providers/directdata/ports/IIBAMACertidaoNegativaEmbargos
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { IBAMACertidaoNegativaEmbargosRetornoDto } from '../dtos/IBAMACertidaoNegativaEmbargosDto.js';

/**
 * Interface para consulta de IBAMACertidaoNegativaEmbargos.
 *
 * @interface IIBAMACertidaoNegativaEmbargos
 */
export interface IIBAMACertidaoNegativaEmbargos {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: IBAMACertidaoNegativaEmbargosRetornoDto | null;
  }>>;
}
