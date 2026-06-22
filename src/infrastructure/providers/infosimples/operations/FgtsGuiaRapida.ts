/**
 * @fileoverview Operation FgtsGuiaRapida — Infosimples API.
 * Endpoint: POST consultas/fgts/guia-rapida
 * @module infrastructure/providers/infosimples/operations/FgtsGuiaRapida
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type FgtsGuiaRapidaItem,
  FgtsGuiaRapidaResponseSchema,
} from '../dtos/FgtsGuiaRapidaDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class FgtsGuiaRapida implements IInfosimplesOperation<FgtsGuiaRapidaItem> {
  readonly path = 'consultas/fgts/guia-rapida';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, FgtsGuiaRapidaItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(FgtsGuiaRapidaResponseSchema, result.value);
  }
}
