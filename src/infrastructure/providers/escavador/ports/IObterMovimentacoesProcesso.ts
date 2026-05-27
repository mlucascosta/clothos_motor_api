import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { MovimentacoesResponse } from '../dtos/MovimentacaoDto.js';

export interface ObterMovimentacoesProcessoInput {
  numeroCnj: string;
  pagina?: number;
}

export interface IObterMovimentacoesProcesso {
  execute(
    input: ObterMovimentacoesProcessoInput,
  ): Promise<Either<SourceError, MovimentacoesResponse>>;
}
