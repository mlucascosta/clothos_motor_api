/**
 * @fileoverview Port para operation CertidaoConjuntaDebitosPessoaFisica.
 * @module infrastructure/providers/directdata/ports/ICertidaoConjuntaDebitosPessoaFisica
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CertidaoConjuntaDebitosPessoaFisicaRetornoDto } from '../dtos/CertidaoConjuntaDebitosPessoaFisicaDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de CertidaoConjuntaDebitosPessoaFisica.
 *
 * @interface ICertidaoConjuntaDebitosPessoaFisica
 */
export interface ICertidaoConjuntaDebitosPessoaFisica {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: CertidaoConjuntaDebitosPessoaFisicaRetornoDto | null;
      }
    >
  >;
}
