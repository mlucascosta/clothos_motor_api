/**
 * @fileoverview Port para operation PessoaExpostaPoliticamente.
 * @module infrastructure/providers/directdata/ports/IPessoaExpostaPoliticamente
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { PessoaExpostaPoliticamenteRetornoDto } from '../dtos/PessoaExpostaPoliticamenteDto.js';

/**
 * Interface para consulta de PessoaExpostaPoliticamente.
 *
 * @interface IPessoaExpostaPoliticamente
 */
export interface IPessoaExpostaPoliticamente {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: PessoaExpostaPoliticamenteRetornoDto | null;
      }
    >
  >;
}
