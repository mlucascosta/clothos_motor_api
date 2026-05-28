/**
 * @fileoverview Port para operation BetSafeCompliance.
 * @module infrastructure/providers/directdata/ports/IBetSafeCompliance
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { BetSafeComplianceRetornoDto } from '../dtos/BetSafeComplianceDto.js';

/**
 * Interface para consulta de BetSafeCompliance.
 *
 * @interface IBetSafeCompliance
 */
export interface IBetSafeCompliance {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: BetSafeComplianceRetornoDto | null;
  }>>;
}
