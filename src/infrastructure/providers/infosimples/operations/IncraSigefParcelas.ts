/**
 * @fileoverview Operation IncraSigefParcelas — Infosimples API.
 * Endpoint: POST consultas/incra/sigef/parcelas
 * @module infrastructure/providers/infosimples/operations/IncraSigefParcelas
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type IncraSigefParcelasItem,
  IncraSigefParcelasResponseSchema,
} from '../dtos/IncraSigefParcelasDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class IncraSigefParcelas implements IInfosimplesOperation<IncraSigefParcelasItem> {
  readonly path = 'consultas/incra/sigef/parcelas';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, IncraSigefParcelasItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(IncraSigefParcelasResponseSchema, result.value, 'infosimples');
  }
}
