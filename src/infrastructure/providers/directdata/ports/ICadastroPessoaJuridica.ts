/**
 * @fileoverview Port para operation CadastroPessoaJuridica.
 * @module infrastructure/providers/directdata/ports/ICadastroPessoaJuridica
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CadastroPessoaJuridicaRetornoDto } from '../dtos/CadastroPessoaJuridicaDto.js';

/**
 * Interface para consulta de CadastroPessoaJuridica.
 *
 * @interface ICadastroPessoaJuridica
 */
export interface ICadastroPessoaJuridica {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CadastroPessoaJuridicaRetornoDto | null;
  }>>;
}
