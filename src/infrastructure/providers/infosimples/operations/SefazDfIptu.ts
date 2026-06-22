/**
 * @fileoverview Operation — Sefaz DF / IPTU
 * Endpoint: POST consultas/sefaz/df/iptu
 * @module infrastructure/providers/infosimples/operations/SefazDfIptu
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import { type SefazDfIptuItem, SefazDfIptuResponseSchema } from '../dtos/SefazDfIptuDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class SefazDfIptu implements IInfosimplesOperation<SefazDfIptuItem> {
  readonly path = 'consultas/sefaz/df/iptu';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SefazDfIptuItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(SefazDfIptuResponseSchema, result.value);
  }
}
