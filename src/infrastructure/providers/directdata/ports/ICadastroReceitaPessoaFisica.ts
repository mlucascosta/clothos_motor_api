/**
 * @fileoverview Port para operation CadastroReceitaPessoaFisica.
 * @module infrastructure/providers/directdata/ports/ICadastroReceitaPessoaFisica
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CadastroReceitaPessoaFisicaRetornoDto } from '../dtos/CadastroReceitaPessoaFisicaDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CadastroReceitaPessoaFisica.
 *
 * @interface ICadastroReceitaPessoaFisica
 */
export interface ICadastroReceitaPessoaFisica {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CadastroReceitaPessoaFisicaRetornoDto | null;
      }
    >
  >;
}
