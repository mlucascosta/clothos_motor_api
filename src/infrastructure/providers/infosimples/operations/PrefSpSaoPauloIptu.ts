/**
 * @fileoverview Operation — Prefeitura SP / São Paulo / IPTU
 * Endpoint: POST consultas/pref/sp/sao-paulo/iptu
 * @module infrastructure/providers/infosimples/operations/PrefSpSaoPauloIptu
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type PrefSpSaoPauloIptuItem,
  PrefSpSaoPauloIptuResponseSchema,
} from '../dtos/PrefSpSaoPauloIptuDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PrefSpSaoPauloIptu implements IInfosimplesOperation<PrefSpSaoPauloIptuItem> {
  readonly path = 'consultas/pref/sp/sao-paulo/iptu';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PrefSpSaoPauloIptuItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PrefSpSaoPauloIptuResponseSchema, result.value);
  }
}
