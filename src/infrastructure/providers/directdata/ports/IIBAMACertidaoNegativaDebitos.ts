/**
 * @fileoverview Port para operation IBAMACertidaoNegativaDebitos.
 * @module infrastructure/providers/directdata/ports/IIBAMACertidaoNegativaDebitos
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { IBAMACertidaoNegativaDebitosRetornoDto } from '../dtos/IBAMACertidaoNegativaDebitosDto.js';

/**
 * Interface para consulta de IBAMACertidaoNegativaDebitos.
 *
 * @interface IIBAMACertidaoNegativaDebitos
 */
export interface IIBAMACertidaoNegativaDebitos {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: IBAMACertidaoNegativaDebitosRetornoDto | null;
  }>>;
}
