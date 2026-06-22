/**
 * @fileoverview Operation SncrImoveis — Infosimples API.
 * Endpoint: POST consultas/sncr/imoveis
 * @module infrastructure/providers/infosimples/operations/SncrImoveis
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import { type SncrImoveisItem, SncrImoveisResponseSchema } from '../dtos/SncrImoveisDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class SncrImoveis implements IInfosimplesOperation<SncrImoveisItem> {
  readonly path = 'consultas/sncr/imoveis';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SncrImoveisItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(SncrImoveisResponseSchema, result.value);
  }
}
