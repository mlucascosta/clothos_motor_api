// GET /api/v1/instituicoes/{id}
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { InstituicaoDto } from '../dtos/InstituicaoDto.js';

export interface ObterInstituicaoInput {
  id: number;
}

export interface IObterInstituicao {
  execute(input: ObterInstituicaoInput): Promise<Either<SourceError, InstituicaoDto>>;
}
