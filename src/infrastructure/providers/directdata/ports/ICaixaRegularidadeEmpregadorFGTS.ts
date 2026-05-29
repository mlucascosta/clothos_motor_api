/**
 * @fileoverview Port para operation CaixaRegularidadeEmpregadorFGTS.
 * @module infrastructure/providers/directdata/ports/ICaixaRegularidadeEmpregadorFGTS
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { CaixaRegularidadeEmpregadorFGTSRetornoDto } from '../dtos/CaixaRegularidadeEmpregadorFGTSDto.js';

/**
 * Interface para consulta de CaixaRegularidadeEmpregadorFGTS.
 *
 * @interface ICaixaRegularidadeEmpregadorFGTS
 */
export interface ICaixaRegularidadeEmpregadorFGTS {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: CaixaRegularidadeEmpregadorFGTSRetornoDto | null;
  }>>;
}
