import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { ListarTribunaisResponse } from '../dtos/TribunalDto.js';
import { ListarTribunaisResponseSchema } from '../dtos/TribunalDto.js';
import type { IListarTribunais } from '../ports/IListarTribunais.js';

export class ListarTribunais implements IListarTribunais {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { tipo?: string }): Promise<Either<SourceError, ListarTribunaisResponse>> {
    const result = await this.http.request<unknown>('/api/v1/tribunal/origens', {
      params: { tipo: input.tipo },
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarTribunaisResponseSchema, result.value, 'escavador');
  }
}
