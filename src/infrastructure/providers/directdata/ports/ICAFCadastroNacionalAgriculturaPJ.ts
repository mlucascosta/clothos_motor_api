/**
 * @fileoverview Port para operation CAFCadastroNacionalAgriculturaPJ.
 * @module infrastructure/providers/directdata/ports/ICAFCadastroNacionalAgriculturaPJ
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CAFCadastroNacionalAgriculturaPJRetornoDto } from '../dtos/CAFCadastroNacionalAgriculturaPJDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CAFCadastroNacionalAgriculturaPJ.
 *
 * @interface ICAFCadastroNacionalAgriculturaPJ
 */
export interface ICAFCadastroNacionalAgriculturaPJ {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CAFCadastroNacionalAgriculturaPJRetornoDto | null;
      }
    >
  >;
}
