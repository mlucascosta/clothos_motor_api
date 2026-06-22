/**
 * @fileoverview Operation IncraCoordenadas — Infosimples API.
 * Endpoint: POST consultas/incra/coordenadas
 * @module infrastructure/providers/infosimples/operations/IncraCoordenadas
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type IncraCoordenadasItem,
  IncraCoordenadasResponseSchema,
} from '../dtos/IncraCoordenadasDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class IncraCoordenadas implements IInfosimplesOperation<IncraCoordenadasItem> {
  readonly path = 'consultas/incra/coordenadas';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, IncraCoordenadasItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(IncraCoordenadasResponseSchema, result.value);
  }
}
