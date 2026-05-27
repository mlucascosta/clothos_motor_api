// GET /api/v1/pessoas/{id}/processos
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { PessoaProcessosResponse } from '../dtos/PessoaDto.js';

export interface ObterProcessosPessoaInput {
  id: number;
  pagina?: number;
}

export interface IObterProcessosPessoa {
  execute(input: ObterProcessosPessoaInput): Promise<Either<SourceError, PessoaProcessosResponse>>;
}
