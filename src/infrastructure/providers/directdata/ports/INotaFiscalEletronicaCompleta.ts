/**
 * @fileoverview Port para operation NotaFiscalEletronicaCompleta.
 * @module infrastructure/providers/directdata/ports/INotaFiscalEletronicaCompleta
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { DirectDataMetaDados } from '../dtos/DirectDataResponseDto.js';
import type { NotaFiscalEletronicaCompletaRetornoDto } from '../dtos/NotaFiscalEletronicaCompletaDto.js';

/**
 * Interface para consulta de NotaFiscalEletronicaCompleta.
 *
 * @interface INotaFiscalEletronicaCompleta
 */
export interface INotaFiscalEletronicaCompleta {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, {
    metaDados: DirectDataMetaDados;
    retorno: NotaFiscalEletronicaCompletaRetornoDto | null;
  }>>;
}
