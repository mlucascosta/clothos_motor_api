/**
 * @fileoverview Operation IbamaCertidaoDebitos — Infosimples API.
 * Endpoint: POST consultas/ibama/certidao-debitos
 * @module infrastructure/providers/infosimples/operations/IbamaCertidaoDebitos
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type IbamaCertidaoDebitosItem,
  IbamaCertidaoDebitosResponseSchema,
} from '../dtos/IbamaCertidaoDebitosDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class IbamaCertidaoDebitos implements IInfosimplesOperation<IbamaCertidaoDebitosItem> {
  readonly path = 'consultas/ibama/certidao-debitos';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, IbamaCertidaoDebitosItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(IbamaCertidaoDebitosResponseSchema, result.value, 'infosimples');
  }
}
