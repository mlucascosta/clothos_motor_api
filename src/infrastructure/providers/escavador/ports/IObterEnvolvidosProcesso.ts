// GET /api/v1/processos/{id}/envolvidos-diarios
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ProcessoEnvolvidosResponse } from '../dtos/ProcessoEnvolvidosDto.js';

export interface ObterEnvolvidosProcessoInput {
  id: number;
}

export interface IObterEnvolvidosProcesso {
  execute(input: ObterEnvolvidosProcessoInput): Promise<Either<SourceError, ProcessoEnvolvidosResponse>>;
}
