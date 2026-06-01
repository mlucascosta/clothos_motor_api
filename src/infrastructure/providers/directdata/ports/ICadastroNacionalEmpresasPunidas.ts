/**
 * @fileoverview Port para operation CadastroNacionalEmpresasPunidas.
 * @module infrastructure/providers/directdata/ports/ICadastroNacionalEmpresasPunidas
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CadastroNacionalEmpresasPunidasRetornoDto } from '../dtos/CadastroNacionalEmpresasPunidasDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CadastroNacionalEmpresasPunidas.
 *
 * @interface ICadastroNacionalEmpresasPunidas
 */
export interface ICadastroNacionalEmpresasPunidas {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CadastroNacionalEmpresasPunidasRetornoDto | null;
      }
    >
  >;
}
