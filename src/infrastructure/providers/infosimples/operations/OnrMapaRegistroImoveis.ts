/**
 * @fileoverview Operation OnrMapaRegistroImoveis — Infosimples API.
 * Endpoint: POST consultas/onr/mapa-registro-imoveis
 * @module infrastructure/providers/infosimples/operations/OnrMapaRegistroImoveis
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type OnrMapaRegistroImoveisItem,
  OnrMapaRegistroImoveisResponseSchema,
} from '../dtos/OnrMapaRegistroImoveisDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class OnrMapaRegistroImoveis implements IInfosimplesOperation<OnrMapaRegistroImoveisItem> {
  readonly path = 'consultas/onr/mapa-registro-imoveis';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, OnrMapaRegistroImoveisItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(OnrMapaRegistroImoveisResponseSchema, result.value);
  }
}
