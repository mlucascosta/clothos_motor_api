import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type ListarCallbacksV2Response,
  ListarCallbacksV2ResponseSchema,
} from '../../dtos/v2/CallbackV2Dto.js';
import type { IListarCallbacksV2 } from '../../ports/IListarCallbacksV2.js';

export class ListarCallbacksV2 implements IListarCallbacksV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<
    Either<SourceError, ListarCallbacksV2Response>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>('/api/v2/callbacks', { params });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarCallbacksV2ResponseSchema, result.value, 'escavador-v2');
  }
}
