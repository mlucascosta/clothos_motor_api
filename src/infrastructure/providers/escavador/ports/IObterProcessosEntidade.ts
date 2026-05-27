import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ProcessosEntidadeResponse } from '../dtos/ProcessoDto.js';

export interface ObterProcessosEntidadeInput {
  entidadeId: number;
  pagina?: number;
}

export interface IObterProcessosEntidade {
  execute(
    input: ObterProcessosEntidadeInput,
  ): Promise<Either<SourceError, ProcessosEntidadeResponse>>;
}
