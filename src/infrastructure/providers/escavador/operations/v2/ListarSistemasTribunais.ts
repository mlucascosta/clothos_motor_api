import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type ListarSistemasResponse,
  ListarSistemasResponseSchema,
} from '../../dtos/v2/TribunalV2Dto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

export interface IListarSistemasTribunais {
  execute(): Promise<Either<SourceError, ListarSistemasResponse>>;
}

export class ListarSistemasTribunais implements IListarSistemasTribunais {
  constructor(private readonly http: IHttpClient) {}

  async execute(): Promise<Either<SourceError, ListarSistemasResponse>> {
    const result = await this.http.request<unknown>('/api/v2/tribunais/sistemas');
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(ListarSistemasResponseSchema, result.value, 'escavador-v2');
  }
}
