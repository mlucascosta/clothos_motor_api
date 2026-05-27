// GET /api/v1/pessoas/{id}
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { PessoaDto } from '../dtos/PessoaDto.js';

export interface ObterPessoaInput {
  id: number;
}

export interface IObterPessoa {
  execute(input: ObterPessoaInput): Promise<Either<SourceError, PessoaDto>>;
}
