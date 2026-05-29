/**
 * @fileoverview Port para operation BeneficiarioFinal.
 * @module infrastructure/providers/directdata/ports/IBeneficiarioFinal
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { BeneficiarioFinalRetornoDto } from '../dtos/BeneficiarioFinalDto.js';

/**
 * Interface para consulta de BeneficiarioFinal.
 *
 * @interface IBeneficiarioFinal
 */
export interface IBeneficiarioFinal {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: BeneficiarioFinalRetornoDto | null;
  }>>;
}
