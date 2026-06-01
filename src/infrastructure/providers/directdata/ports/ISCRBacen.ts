/**
 * @fileoverview Port para operation SCRBacen.
 * @module infrastructure/providers/directdata/ports/ISCRBacen
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { SCRBacenRetornoDto } from '../dtos/SCRBacenDto.js';

/**
 * Interface para consulta de SCRBacen.
 *
 * @interface ISCRBacen
 */
export interface ISCRBacen {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: SCRBacenRetornoDto | null;
      }
    >
  >;
}
