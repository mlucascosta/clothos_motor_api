/**
 * @fileoverview Operation CarImovel — Infosimples API.
 * Endpoint: POST consultas/car/imovel
 * @module infrastructure/providers/infosimples/operations/CarImovel
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { type CarImovelItem, CarImovelResponseSchema } from '../dtos/CarImovelDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class CarImovel implements IInfosimplesOperation<CarImovelItem> {
  readonly path = 'consultas/car/imovel';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CarImovelItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(CarImovelResponseSchema, result.value, 'infosimples');
  }
}
