import { type Either, left, right } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type ListarCallbacksV2Response,
  ListarCallbacksV2ResponseSchema,
} from '../../dtos/v2/CallbackV2Dto.js';

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
    const parsed = ListarCallbacksV2ResponseSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
