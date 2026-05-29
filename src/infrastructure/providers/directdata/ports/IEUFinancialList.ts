/**
 * @fileoverview Port para operation EUFinancialList.
 * @module infrastructure/providers/directdata/ports/IEUFinancialList
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { EUFinancialListRetornoDto } from '../dtos/EUFinancialListDto.js';

/**
 * Interface para consulta de EUFinancialList.
 *
 * @interface IEUFinancialList
 */
export interface IEUFinancialList {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: EUFinancialListRetornoDto | null;
  }>>;
}
