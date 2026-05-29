/**
 * @fileoverview Port para operation CertidaoNegativaDebitosImovelRural.
 * @module infrastructure/providers/directdata/ports/ICertidaoNegativaDebitosImovelRural
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CertidaoNegativaDebitosImovelRuralRetornoDto } from '../dtos/CertidaoNegativaDebitosImovelRuralDto.js';

/**
 * Interface para consulta de CertidaoNegativaDebitosImovelRural.
 *
 * @interface ICertidaoNegativaDebitosImovelRural
 */
export interface ICertidaoNegativaDebitosImovelRural {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CertidaoNegativaDebitosImovelRuralRetornoDto | null;
  }>>;
}
