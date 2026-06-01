import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { ListarCallbacksResponse } from '../dtos/CallbackDto.js';
import { ListarCallbacksResponseSchema } from '../dtos/CallbackDto.js';
import type { IListarCallbacks } from '../ports/IListarCallbacks.js';

export class ListarCallbacks implements IListarCallbacks {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<Either<SourceError, ListarCallbacksResponse>> {
    const result = await this.http.request<unknown>('/api/v1/callbacks', {
      params: { page: input.pagina },
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarCallbacksResponseSchema, result.value, 'escavador');
  }
}
