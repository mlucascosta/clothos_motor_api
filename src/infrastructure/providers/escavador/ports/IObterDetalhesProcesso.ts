import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ProcessoDto } from '../dtos/ProcessoDto.js';

export interface ObterDetalhesProcessoInput {
  numeroCnj: string;
}

export interface IObterDetalhesProcesso {
  execute(input: ObterDetalhesProcessoInput): Promise<Either<SourceError, ProcessoDto>>;
}
