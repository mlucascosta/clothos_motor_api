/**
 * @fileoverview Operation — Prefeitura SP / São Paulo / IPTU 2ª Via
 * Endpoint: POST consultas/pref/sp/sao-paulo/iptu2via
 * @module infrastructure/providers/infosimples/operations/PrefSpSaoPauloIptu2via
 */
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { PrefSpSaoPauloIptu2viaResponseSchema, type PrefSpSaoPauloIptu2viaItem } from '../dtos/PrefSpSaoPauloIptu2viaDto.js';

export class PrefSpSaoPauloIptu2via implements IInfosimplesOperation<PrefSpSaoPauloIptu2viaItem> {
  readonly path = 'consultas/pref/sp/sao-paulo/iptu2via';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(PrefSpSaoPauloIptu2viaResponseSchema, result.value, 'infosimples');
  }
}
