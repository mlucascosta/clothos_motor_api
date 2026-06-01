/**
 * @fileoverview Port para operation BoaVistaAcertaCompletoPositivoPF.
 * @module infrastructure/providers/directdata/ports/IBoaVistaAcertaCompletoPositivoPF
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { BoaVistaAcertaCompletoPositivoPFRetornoDto } from '../dtos/BoaVistaAcertaCompletoPositivoPFDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de BoaVistaAcertaCompletoPositivoPF.
 *
 * @interface IBoaVistaAcertaCompletoPositivoPF
 */
export interface IBoaVistaAcertaCompletoPositivoPF {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: BoaVistaAcertaCompletoPositivoPFRetornoDto | null;
      }
    >
  >;
}
