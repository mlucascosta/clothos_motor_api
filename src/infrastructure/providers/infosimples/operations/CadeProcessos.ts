/**
 * @fileoverview Operation — CADE / Processos
 * Endpoint: POST consultas/cade/processos
 * @module infrastructure/providers/infosimples/operations/CadeProcessos
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import { type CadeProcessosItem, CadeProcessosResponseSchema } from '../dtos/CadeProcessosDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class CadeProcessos implements IInfosimplesOperation<CadeProcessosItem> {
  readonly path = 'consultas/cade/processos';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CadeProcessosItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(CadeProcessosResponseSchema, result.value);
  }
}
