/**
 * @fileoverview Port para operation CertidaoNegativaDebitos.
 * @module infrastructure/providers/directdata/ports/ICertidaoNegativaDebitos
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CertidaoNegativaDebitosRetornoDto } from '../dtos/CertidaoNegativaDebitosDto.js';

/**
 * Interface para consulta de CertidaoNegativaDebitos.
 *
 * @interface ICertidaoNegativaDebitos
 */
export interface ICertidaoNegativaDebitos {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CertidaoNegativaDebitosRetornoDto | null;
  }>>;
}
