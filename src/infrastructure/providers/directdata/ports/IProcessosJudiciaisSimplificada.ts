/**
 * @fileoverview Port para operation ProcessosJudiciaisSimplificada.
 * @module infrastructure/providers/directdata/ports/IProcessosJudiciaisSimplificada
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { ProcessosJudiciaisSimplificadaRetornoDto } from '../dtos/ProcessosJudiciaisSimplificadaDto.js';

/**
 * Interface para consulta de ProcessosJudiciaisSimplificada.
 *
 * @interface IProcessosJudiciaisSimplificada
 */
export interface IProcessosJudiciaisSimplificada {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<
    Either<
      SourceError,
      {
        metaDados: DirectDataMetaDados;
        retorno: ProcessosJudiciaisSimplificadaRetornoDto | null;
      }
    >
  >;
}
