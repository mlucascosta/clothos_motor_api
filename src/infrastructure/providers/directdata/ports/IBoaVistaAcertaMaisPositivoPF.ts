/**
 * @fileoverview Port para operation BoaVistaAcertaMaisPositivoPF.
 * @module infrastructure/providers/directdata/ports/IBoaVistaAcertaMaisPositivoPF
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { BoaVistaAcertaMaisPositivoPFRetornoDto } from '../dtos/BoaVistaAcertaMaisPositivoPFDto.js';

/**
 * Interface para consulta de BoaVistaAcertaMaisPositivoPF.
 *
 * @interface IBoaVistaAcertaMaisPositivoPF
 */
export interface IBoaVistaAcertaMaisPositivoPF {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: BoaVistaAcertaMaisPositivoPFRetornoDto | null;
  }>>;
}
