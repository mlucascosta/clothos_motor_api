/**
 * @fileoverview Port para operation ReceitaFederalPessoaFisica.
 * @module infrastructure/providers/directdata/ports/IReceitaFederalPessoaFisica
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { ReceitaFederalPessoaFisicaRetornoDto } from '../dtos/ReceitaFederalPessoaFisicaDto.js';

/**
 * Interface para consulta de ReceitaFederalPessoaFisica.
 *
 * @interface IReceitaFederalPessoaFisica
 */
export interface IReceitaFederalPessoaFisica {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: ReceitaFederalPessoaFisicaRetornoDto | null;
  }>>;
}
