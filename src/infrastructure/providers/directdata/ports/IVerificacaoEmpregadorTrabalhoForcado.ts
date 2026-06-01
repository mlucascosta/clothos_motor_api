/**
 * @fileoverview Port para operation VerificacaoEmpregadorTrabalhoForcado.
 * @module infrastructure/providers/directdata/ports/IVerificacaoEmpregadorTrabalhoForcado
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { VerificacaoEmpregadorTrabalhoForcadoRetornoDto } from '../dtos/VerificacaoEmpregadorTrabalhoForcadoDto.js';

/**
 * Interface para consulta de VerificacaoEmpregadorTrabalhoForcado.
 *
 * @interface IVerificacaoEmpregadorTrabalhoForcado
 */
export interface IVerificacaoEmpregadorTrabalhoForcado {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: VerificacaoEmpregadorTrabalhoForcadoRetornoDto | null;
      }
    >
  >;
}
