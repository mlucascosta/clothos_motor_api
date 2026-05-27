import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { ListarSistemasResponseSchema, type ListarSistemasResponse } from '../../dtos/v2/TribunalV2Dto.js';

export interface IListarSistemasTribunais {
  execute(): Promise<Either<SourceError, ListarSistemasResponse>>;
}

export class ListarSistemasTribunais implements IListarSistemasTribunais {
  constructor(private readonly http: IHttpClient) {}

  async execute(): Promise<Either<SourceError, ListarSistemasResponse>> {
    const result = await this.http.request<unknown>('/api/v2/tribunais/sistemas');
    if (result._tag === 'Left') return result;
    const parsed = ListarSistemasResponseSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
