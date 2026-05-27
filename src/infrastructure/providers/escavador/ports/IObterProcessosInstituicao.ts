// GET /api/v1/instituicoes/{id}/processos — reutiliza PessoaProcessosResponse (mesma shape)
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { PessoaProcessosResponse } from '../dtos/PessoaDto.js';

export interface ObterProcessosInstituicaoInput {
  id: number;
  pagina?: number;
}

export interface IObterProcessosInstituicao {
  execute(input: ObterProcessosInstituicaoInput): Promise<Either<SourceError, PessoaProcessosResponse>>;
}
