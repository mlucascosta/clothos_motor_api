/**
 * @fileoverview Port para operation CadastroPessoaFisica.
 * @module infrastructure/providers/directdata/ports/ICadastroPessoaFisica
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CadastroPessoaFisicaRetornoDto } from '../dtos/CadastroPessoaFisicaDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CadastroPessoaFisica.
 *
 * @interface ICadastroPessoaFisica
 */
export interface ICadastroPessoaFisica {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CadastroPessoaFisicaRetornoDto | null;
      }
    >
  >;
}
