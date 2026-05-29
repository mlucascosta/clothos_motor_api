/**
 * @fileoverview Port para operation ProcessosJudiciaisCompleta.
 * @module infrastructure/providers/directdata/ports/IProcessosJudiciaisCompleta
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { ProcessosJudiciaisCompletaRetornoDto } from '../dtos/ProcessosJudiciaisCompletaDto.js';

/**
 * Interface para consulta de ProcessosJudiciaisCompleta.
 *
 * @interface IProcessosJudiciaisCompleta
 */
export interface IProcessosJudiciaisCompleta {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: ProcessosJudiciaisCompletaRetornoDto | null;
  }>>;
}
