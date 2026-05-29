/**
 * @fileoverview Port para operation NotaFiscalEletronicaInutilizacao.
 * @module infrastructure/providers/directdata/ports/INotaFiscalEletronicaInutilizacao
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { NotaFiscalEletronicaInutilizacaoRetornoDto } from '../dtos/NotaFiscalEletronicaInutilizacaoDto.js';

/**
 * Interface para consulta de NotaFiscalEletronicaInutilizacao.
 *
 * @interface INotaFiscalEletronicaInutilizacao
 */
export interface INotaFiscalEletronicaInutilizacao {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: NotaFiscalEletronicaInutilizacaoRetornoDto | null;
  }>>;
}
