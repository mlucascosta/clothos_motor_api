import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type ListarTribunaisV2Response,
  ListarTribunaisV2ResponseSchema,
} from '../../dtos/v2/TribunalV2Dto.js';
import type { IListarTribunaisV2 } from '../../ports/IListarTribunaisV2.js';

export class ListarTribunaisV2 implements IListarTribunaisV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { sistema_id?: number }): Promise<
    Either<SourceError, ListarTribunaisV2Response>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.sistema_id !== undefined) params['sistema_id'] = input.sistema_id;

    const result = await this.http.request<unknown>('/api/v2/tribunais', { params });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarTribunaisV2ResponseSchema, result.value, 'escavador-v2');
  }
}
