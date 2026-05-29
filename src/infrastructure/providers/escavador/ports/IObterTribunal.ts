// GET /api/v1/tribunais/{id}
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { TribunalDto } from '../dtos/TribunalDto.js';

export interface ObterTribunalInput {
  id: number;
}

export interface IObterTribunal {
  execute(input: ObterTribunalInput): Promise<Either<SourceError, TribunalDto>>;
}
