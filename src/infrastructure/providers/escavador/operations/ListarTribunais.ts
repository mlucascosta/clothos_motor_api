import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { ListarTribunaisResponse } from '../dtos/TribunalDto.js';
import { ListarTribunaisResponseSchema } from '../dtos/TribunalDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export interface IListarTribunais {
  execute(input: { tipo?: string }): Promise<Either<SourceError, ListarTribunaisResponse>>;
}

export class ListarTribunais implements IListarTribunais {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { tipo?: string }): Promise<Either<SourceError, ListarTribunaisResponse>> {
    const result = await this.http.request<unknown>('/api/v1/tribunais', {
      params: { tipo: input.tipo },
    });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(ListarTribunaisResponseSchema, result.value, 'escavador');
  }
}
