// GET /api/v1/movimentacoes/{id}
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { MovimentacaoDto } from '../dtos/MovimentacaoDto.js';

export interface ObterMovimentacaoInput {
  id: number;
}

export interface IObterMovimentacao {
  execute(input: ObterMovimentacaoInput): Promise<Either<SourceError, MovimentacaoDto>>;
}
