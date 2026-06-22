/**
 * @fileoverview Operation — IEPTB / Protestos
 * Endpoint: POST consultas/ieptb/protestos
 * @module infrastructure/providers/infosimples/operations/IeptbProtestos
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type IeptbProtestosItem,
  IeptbProtestosResponseSchema,
} from '../dtos/IeptbProtestosDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class IeptbProtestos implements IInfosimplesOperation<IeptbProtestosItem> {
  readonly path = 'consultas/ieptb/protestos';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, IeptbProtestosItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(IeptbProtestosResponseSchema, result.value);
  }
}
