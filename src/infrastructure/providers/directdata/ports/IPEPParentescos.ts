/**
 * @fileoverview Port para operation PEPParentescos.
 * @module infrastructure/providers/directdata/ports/IPEPParentescos
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { PEPParentescosRetornoDto } from '../dtos/PEPParentescosDto.js';

/**
 * Interface para consulta de PEPParentescos.
 *
 * @interface IPEPParentescos
 */
export interface IPEPParentescos {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: PEPParentescosRetornoDto | null;
  }>>;
}
