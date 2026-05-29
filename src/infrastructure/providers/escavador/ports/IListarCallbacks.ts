// GET /api/v1/callback
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ListarCallbacksResponse } from '../dtos/CallbackDto.js';

export interface ListarCallbacksInput {
  pagina?: number;
}

export interface IListarCallbacks {
  execute(input: ListarCallbacksInput): Promise<Either<SourceError, ListarCallbacksResponse>>;
}
