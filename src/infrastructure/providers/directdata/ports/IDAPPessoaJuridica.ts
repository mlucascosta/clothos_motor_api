/**
 * @fileoverview Port para operation DAPPessoaJuridica.
 * @module infrastructure/providers/directdata/ports/IDAPPessoaJuridica
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { DAPPessoaJuridicaRetornoDto } from '../dtos/DAPPessoaJuridicaDto.js';

/**
 * Interface para consulta de DAPPessoaJuridica.
 *
 * @interface IDAPPessoaJuridica
 */
export interface IDAPPessoaJuridica {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: DAPPessoaJuridicaRetornoDto | null;
  }>>;
}
