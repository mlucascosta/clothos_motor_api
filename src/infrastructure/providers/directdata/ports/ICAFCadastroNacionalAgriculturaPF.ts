/**
 * @fileoverview Port para operation CAFCadastroNacionalAgriculturaPF.
 * @module infrastructure/providers/directdata/ports/ICAFCadastroNacionalAgriculturaPF
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CAFCadastroNacionalAgriculturaPFRetornoDto } from '../dtos/CAFCadastroNacionalAgriculturaPFDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CAFCadastroNacionalAgriculturaPF.
 *
 * @interface ICAFCadastroNacionalAgriculturaPF
 */
export interface ICAFCadastroNacionalAgriculturaPF {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CAFCadastroNacionalAgriculturaPFRetornoDto | null;
      }
    >
  >;
}
