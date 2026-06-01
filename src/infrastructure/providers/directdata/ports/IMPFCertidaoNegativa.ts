/**
 * @fileoverview Port para operation MPFCertidaoNegativa.
 * @module infrastructure/providers/directdata/ports/IMPFCertidaoNegativa
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { MPFCertidaoNegativaRetornoDto } from '../dtos/MPFCertidaoNegativaDto.js';

/**
 * Interface para consulta de MPFCertidaoNegativa.
 *
 * @interface IMPFCertidaoNegativa
 */
export interface IMPFCertidaoNegativa {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: MPFCertidaoNegativaRetornoDto | null;
      }
    >
  >;
}
