// GET /api/v1/tribunais
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ListarTribunaisResponse } from '../dtos/TribunalDto.js';

export interface ListarTribunaisInput {
  tipo?: string;
}

export interface IListarTribunais {
  execute(input: ListarTribunaisInput): Promise<Either<SourceError, ListarTribunaisResponse>>;
}
