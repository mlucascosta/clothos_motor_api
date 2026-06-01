/**
 * @fileoverview Port para operation ProcessosJudiciaisAgrupada.
 * @module infrastructure/providers/directdata/ports/IProcessosJudiciaisAgrupada
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { ProcessosJudiciaisAgrupadaRetornoDto } from '../dtos/ProcessosJudiciaisAgrupadaDto.js';

/**
 * Interface para consulta de ProcessosJudiciaisAgrupada.
 *
 * @interface IProcessosJudiciaisAgrupada
 */
export interface IProcessosJudiciaisAgrupada {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: ProcessosJudiciaisAgrupadaRetornoDto | null;
      }
    >
  >;
}
