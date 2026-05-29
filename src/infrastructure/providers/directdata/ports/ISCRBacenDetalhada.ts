/**
 * @fileoverview Port para operation SCRBacenDetalhada.
 * @module infrastructure/providers/directdata/ports/ISCRBacenDetalhada
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SCRBacenDetalhadaRetornoDto } from '../dtos/SCRBacenDetalhadaDto.js';

/**
 * Interface para consulta de SCRBacenDetalhada.
 *
 * @interface ISCRBacenDetalhada
 */
export interface ISCRBacenDetalhada {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: SCRBacenDetalhadaRetornoDto | null;
  }>>;
}
