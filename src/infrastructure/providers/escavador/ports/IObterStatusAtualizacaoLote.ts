import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { AtualizacaoLoteDto } from '../dtos/v2/AtualizacaoDto.js';

export interface IObterStatusAtualizacaoLote {
  execute(input: { id: number }): Promise<Either<SourceError, AtualizacaoLoteDto>>;
}
