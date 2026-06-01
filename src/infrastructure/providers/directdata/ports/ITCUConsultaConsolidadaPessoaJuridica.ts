/**
 * @fileoverview Port para operation TCUConsultaConsolidadaPessoaJuridica.
 * @module infrastructure/providers/directdata/ports/ITCUConsultaConsolidadaPessoaJuridica
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { TCUConsultaConsolidadaPessoaJuridicaRetornoDto } from '../dtos/TCUConsultaConsolidadaPessoaJuridicaDto.js';

/**
 * Interface para consulta de TCUConsultaConsolidadaPessoaJuridica.
 *
 * @interface ITCUConsultaConsolidadaPessoaJuridica
 */
export interface ITCUConsultaConsolidadaPessoaJuridica {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: TCUConsultaConsolidadaPessoaJuridicaRetornoDto | null;
      }
    >
  >;
}
