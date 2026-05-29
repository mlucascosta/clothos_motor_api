import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type ListarSistemasResponse,
  ListarSistemasResponseSchema,
} from '../../dtos/v2/TribunalV2Dto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IListarSistemasTribunais } from '../../ports/IListarSistemasTribunais.js';

export class ListarSistemasTribunais implements IListarSistemasTribunais {
  constructor(private readonly http: IHttpClient) {}

  async execute(): Promise<Either<SourceError, ListarSistemasResponse>> {
    const result = await this.http.request<unknown>('/api/v2/tribunais/sistemas');
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarSistemasResponseSchema, result.value, 'escavador-v2');
  }
}
