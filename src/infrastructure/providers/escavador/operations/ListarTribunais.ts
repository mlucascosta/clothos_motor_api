import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { ListarTribunaisResponse } from '../dtos/TribunalDto.js';
import { ListarTribunaisResponseSchema } from '../dtos/TribunalDto.js';

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
    const parsed = ListarTribunaisResponseSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
