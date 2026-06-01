/**
 * @fileoverview Port para operation DAPPessoaFisica.
 * @module infrastructure/providers/directdata/ports/IDAPPessoaFisica
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DAPPessoaFisicaRetornoDto } from '../dtos/DAPPessoaFisicaDto.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';

/**
 * Interface para consulta de DAPPessoaFisica.
 *
 * @interface IDAPPessoaFisica
 */
export interface IDAPPessoaFisica {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: DAPPessoaFisicaRetornoDto | null;
      }
    >
  >;
}
