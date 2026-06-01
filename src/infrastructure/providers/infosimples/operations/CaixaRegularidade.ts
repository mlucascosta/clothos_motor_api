/**
 * @fileoverview Operation CaixaRegularidade — Infosimples API.
 * Endpoint: POST consultas/caixa/regularidade
 * @module infrastructure/providers/infosimples/operations/CaixaRegularidade
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type CaixaRegularidadeItem,
  CaixaRegularidadeResponseSchema,
} from '../dtos/CaixaRegularidadeDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class CaixaRegularidade implements IInfosimplesOperation<CaixaRegularidadeItem> {
  readonly path = 'consultas/caixa/regularidade';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CaixaRegularidadeItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(CaixaRegularidadeResponseSchema, result.value, 'infosimples');
  }
}
