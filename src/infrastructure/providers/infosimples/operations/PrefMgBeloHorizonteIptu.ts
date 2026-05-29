/**
 * @fileoverview Operation — Prefeitura MG / Belo Horizonte / IPTU
 * Endpoint: POST consultas/pref/mg/belo-horizonte/iptu
 * @module infrastructure/providers/infosimples/operations/PrefMgBeloHorizonteIptu
 */
import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { PrefMgBeloHorizonteIptuResponseSchema, type PrefMgBeloHorizonteIptuItem } from '../dtos/PrefMgBeloHorizonteIptuDto.js';

export class PrefMgBeloHorizonteIptu implements IInfosimplesOperation<PrefMgBeloHorizonteIptuItem> {
  readonly path = 'consultas/pref/mg/belo-horizonte/iptu';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(PrefMgBeloHorizonteIptuResponseSchema, result.value, 'infosimples');
  }
}
