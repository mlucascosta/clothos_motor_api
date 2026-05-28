import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type ListarCallbacksV2Response,
  ListarCallbacksV2ResponseSchema,
} from '../../dtos/v2/CallbackV2Dto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

export interface IListarCallbacksV2 {
  execute(input: { pagina?: number }): Promise<Either<SourceError, ListarCallbacksV2Response>>;
}

export class ListarCallbacksV2 implements IListarCallbacksV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<
    Either<SourceError, ListarCallbacksV2Response>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>('/api/v2/callbacks', { params });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(ListarCallbacksV2ResponseSchema, result.value, 'escavador-v2');
  }
}
