/**
 * @fileoverview Port para operation AcordosLeniencia.
 * @module infrastructure/providers/directdata/ports/IAcordosLeniencia
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { AcordosLenienciaRetornoDto } from '../dtos/AcordosLenienciaDto.js';

/**
 * Interface para consulta de AcordosLeniencia.
 *
 * @interface IAcordosLeniencia
 */
export interface IAcordosLeniencia {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: AcordosLenienciaRetornoDto | null;
  }>>;
}
