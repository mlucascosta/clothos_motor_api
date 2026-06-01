/**
 * @fileoverview Operation IncraSigefRequerimentos — Infosimples API.
 * Endpoint: POST consultas/incra/sigef/requerimentos
 * @module infrastructure/providers/infosimples/operations/IncraSigefRequerimentos
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type IncraSigefRequerimentosItem,
  IncraSigefRequerimentosResponseSchema,
} from '../dtos/IncraSigefRequerimentosDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class IncraSigefRequerimentos implements IInfosimplesOperation<IncraSigefRequerimentosItem> {
  readonly path = 'consultas/incra/sigef/requerimentos';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, IncraSigefRequerimentosItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(IncraSigefRequerimentosResponseSchema, result.value, 'infosimples');
  }
}
