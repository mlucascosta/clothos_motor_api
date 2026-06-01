/**
 * @fileoverview Port para operation CadastroPessoaFisicaPlus.
 * @module infrastructure/providers/directdata/ports/ICadastroPessoaFisicaPlus
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CadastroPessoaFisicaPlusRetornoDto } from '../dtos/CadastroPessoaFisicaPlusDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CadastroPessoaFisicaPlus.
 *
 * @interface ICadastroPessoaFisicaPlus
 */
export interface ICadastroPessoaFisicaPlus {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CadastroPessoaFisicaPlusRetornoDto | null;
      }
    >
  >;
}
