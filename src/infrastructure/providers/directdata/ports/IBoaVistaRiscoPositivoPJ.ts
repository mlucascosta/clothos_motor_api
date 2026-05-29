/**
 * @fileoverview Port para operation BoaVistaRiscoPositivoPJ.
 * @module infrastructure/providers/directdata/ports/IBoaVistaRiscoPositivoPJ
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { BoaVistaRiscoPositivoPJRetornoDto } from '../dtos/BoaVistaRiscoPositivoPJDto.js';

/**
 * Interface para consulta de BoaVistaRiscoPositivoPJ.
 *
 * @interface IBoaVistaRiscoPositivoPJ
 */
export interface IBoaVistaRiscoPositivoPJ {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: BoaVistaRiscoPositivoPJRetornoDto | null;
  }>>;
}
