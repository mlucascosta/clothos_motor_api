/**
 * @fileoverview Contrato para busca de processo por número CNJ no DataJud.
 * @module infrastructure/providers/datajud/operations/IBuscarProcessoPorNumero
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DataJudSearchResponseDto } from '../dtos/DataJudSearchResponseDto.js';
import type { BuscarProcessoPorNumeroInput } from './BuscarProcessoPorNumero.js';

/**
 * Interface para busca de processo por número CNJ no DataJud.
 * Permite substituição por mock em testes de DataJudExecutor.
 *
 * @interface IBuscarProcessoPorNumero
 */
export interface IBuscarProcessoPorNumero {
  execute(
    input: BuscarProcessoPorNumeroInput,
  ): Promise<Either<SourceError, DataJudSearchResponseDto>>;
}
