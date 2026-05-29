import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { AtualizacaoProcessoDto } from '../dtos/v2/AtualizacaoDto.js';

export interface IObterStatusAtualizacaoProcesso {
  execute(input: { id: string }): Promise<Either<SourceError, AtualizacaoProcessoDto>>;
}
