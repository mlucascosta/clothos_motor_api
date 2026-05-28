/**
 * @fileoverview Operation IncraCoordenadas — Infosimples API.
 * Endpoint: POST consultas/incra/coordenadas
 * @module infrastructure/providers/infosimples/operations/IncraCoordenadas
 */
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { IncraCoordenadasResponseSchema, type IncraCoordenadasItem } from '../dtos/IncraCoordenadasDto.js';

export class IncraCoordenadas implements IInfosimplesOperation<IncraCoordenadasItem> {
  readonly path = 'consultas/incra/coordenadas';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(IncraCoordenadasResponseSchema, result.value, 'infosimples');
  }
}
