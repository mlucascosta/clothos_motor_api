import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { ListarCallbacksResponse } from '../dtos/CallbackDto.js';
import { ListarCallbacksResponseSchema } from '../dtos/CallbackDto.js';

export interface IListarCallbacks {
  execute(input: { pagina?: number }): Promise<Either<SourceError, ListarCallbacksResponse>>;
}

export class ListarCallbacks implements IListarCallbacks {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<Either<SourceError, ListarCallbacksResponse>> {
    const result = await this.http.request<unknown>('/api/v1/callbacks', {
      params: { page: input.pagina },
    });
    if (result._tag === 'Left') return result;
    const parsed = ListarCallbacksResponseSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
