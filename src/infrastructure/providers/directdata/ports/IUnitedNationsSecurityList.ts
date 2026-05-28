/**
 * @fileoverview Port para operation UnitedNationsSecurityList.
 * @module infrastructure/providers/directdata/ports/IUnitedNationsSecurityList
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { UnitedNationsSecurityListRetornoDto } from '../dtos/UnitedNationsSecurityListDto.js';

/**
 * Interface para consulta de UnitedNationsSecurityList.
 *
 * @interface IUnitedNationsSecurityList
 */
export interface IUnitedNationsSecurityList {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: UnitedNationsSecurityListRetornoDto | null;
  }>>;
}
