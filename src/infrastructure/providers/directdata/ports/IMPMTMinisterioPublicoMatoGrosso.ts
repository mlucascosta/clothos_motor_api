/**
 * @fileoverview Port para operation MPMTMinisterioPublicoMatoGrosso.
 * @module infrastructure/providers/directdata/ports/IMPMTMinisterioPublicoMatoGrosso
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { MPMTMinisterioPublicoMatoGrossoRetornoDto } from '../dtos/MPMTMinisterioPublicoMatoGrossoDto.js';

/**
 * Interface para consulta de MPMTMinisterioPublicoMatoGrosso.
 *
 * @interface IMPMTMinisterioPublicoMatoGrosso
 */
export interface IMPMTMinisterioPublicoMatoGrosso {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: MPMTMinisterioPublicoMatoGrossoRetornoDto | null;
      }
    >
  >;
}
