/**
 * @fileoverview Operation IncraSigefDetalhesParcela — Infosimples API.
 * Endpoint: POST consultas/incra/sigef/detalhes-parcela
 * @module infrastructure/providers/infosimples/operations/IncraSigefDetalhesParcela
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type IncraSigefDetalhesParcelaItem,
  IncraSigefDetalhesParcelaResponseSchema,
} from '../dtos/IncraSigefDetalhesParcelaDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class IncraSigefDetalhesParcela
  implements IInfosimplesOperation<IncraSigefDetalhesParcelaItem>
{
  readonly path = 'consultas/incra/sigef/detalhes-parcela';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, IncraSigefDetalhesParcelaItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(IncraSigefDetalhesParcelaResponseSchema, result.value, 'infosimples');
  }
}
