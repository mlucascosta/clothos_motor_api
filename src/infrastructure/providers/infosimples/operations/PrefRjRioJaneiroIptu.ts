/**
 * @fileoverview Operation — Prefeitura RJ / Rio de Janeiro / IPTU
 * Endpoint: POST consultas/pref/rj/rio-janeiro/iptu
 * @module infrastructure/providers/infosimples/operations/PrefRjRioJaneiroIptu
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type PrefRjRioJaneiroIptuItem,
  PrefRjRioJaneiroIptuResponseSchema,
} from '../dtos/PrefRjRioJaneiroIptuDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class PrefRjRioJaneiroIptu implements IInfosimplesOperation<PrefRjRioJaneiroIptuItem> {
  readonly path = 'consultas/pref/rj/rio-janeiro/iptu';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PrefRjRioJaneiroIptuItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(PrefRjRioJaneiroIptuResponseSchema, result.value);
  }
}
