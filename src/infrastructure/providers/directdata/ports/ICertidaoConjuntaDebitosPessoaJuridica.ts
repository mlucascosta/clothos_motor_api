/**
 * @fileoverview Port para operation CertidaoConjuntaDebitosPessoaJuridica.
 * @module infrastructure/providers/directdata/ports/ICertidaoConjuntaDebitosPessoaJuridica
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CertidaoConjuntaDebitosPessoaJuridicaRetornoDto } from '../dtos/CertidaoConjuntaDebitosPessoaJuridicaDto.js';

/**
 * Interface para consulta de CertidaoConjuntaDebitosPessoaJuridica.
 *
 * @interface ICertidaoConjuntaDebitosPessoaJuridica
 */
export interface ICertidaoConjuntaDebitosPessoaJuridica {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CertidaoConjuntaDebitosPessoaJuridicaRetornoDto | null;
  }>>;
}
