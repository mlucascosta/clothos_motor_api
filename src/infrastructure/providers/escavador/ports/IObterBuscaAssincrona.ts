// GET /api/v1/buscas-assincronas/{id}
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { BuscaAssincronaDto } from '../dtos/BuscaAssincronaDto.js';

export interface ObterBuscaAssincronaInput {
  id: number;
}

export interface IObterBuscaAssincrona {
  execute(input: ObterBuscaAssincronaInput): Promise<Either<SourceError, BuscaAssincronaDto>>;
}
