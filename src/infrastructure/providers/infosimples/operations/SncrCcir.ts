/**
 * @fileoverview Operation SncrCcir — Infosimples API.
 * Endpoint: POST consultas/sncr/ccir
 * @module infrastructure/providers/infosimples/operations/SncrCcir
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import { type SncrCcirItem, SncrCcirResponseSchema } from '../dtos/SncrCcirDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class SncrCcir implements IInfosimplesOperation<SncrCcirItem> {
  readonly path = 'consultas/sncr/ccir';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SncrCcirItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(SncrCcirResponseSchema, result.value);
  }
}
