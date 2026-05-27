// GET /api/v1/instituicoes/{id}/pessoas
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { InstituicaoPessoasResponse } from '../dtos/InstituicaoDto.js';

export interface ObterPessoasInstituicaoInput {
  id: number;
  pagina?: number;
}

export interface IObterPessoasInstituicao {
  execute(input: ObterPessoasInstituicaoInput): Promise<Either<SourceError, InstituicaoPessoasResponse>>;
}
