/**
 * @fileoverview Operation — Prefeitura SP / São Paulo / Débitos IPTU
 * Endpoint: POST consultas/pref/sp/sao-paulo/debitos-iptu
 * @module infrastructure/providers/infosimples/operations/PrefSpSaoPauloDebitosIptu
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type PrefSpSaoPauloDebitosIptuItem,
  PrefSpSaoPauloDebitosIptuResponseSchema,
} from '../dtos/PrefSpSaoPauloDebitosIptuDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PrefSpSaoPauloDebitosIptu
  implements IInfosimplesOperation<PrefSpSaoPauloDebitosIptuItem>
{
  readonly path = 'consultas/pref/sp/sao-paulo/debitos-iptu';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PrefSpSaoPauloDebitosIptuItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PrefSpSaoPauloDebitosIptuResponseSchema, result.value);
  }
}
