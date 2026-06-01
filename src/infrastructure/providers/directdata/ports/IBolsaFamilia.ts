/**
 * @fileoverview Port para operation BolsaFamilia.
 * @module infrastructure/providers/directdata/ports/IBolsaFamilia
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { BolsaFamiliaRetornoDto } from '../dtos/BolsaFamiliaDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de BolsaFamilia.
 *
 * @interface IBolsaFamilia
 */
export interface IBolsaFamilia {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: BolsaFamiliaRetornoDto | null;
      }
    >
  >;
}
