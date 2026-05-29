/**
 * @fileoverview Port para operation UKHmTreasury.
 * @module infrastructure/providers/directdata/ports/IUKHmTreasury
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { UKHmTreasuryRetornoDto } from '../dtos/UKHmTreasuryDto.js';

/**
 * Interface para consulta de UKHmTreasury.
 *
 * @interface IUKHmTreasury
 */
export interface IUKHmTreasury {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: UKHmTreasuryRetornoDto | null;
  }>>;
}
