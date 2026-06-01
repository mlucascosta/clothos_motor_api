/**
 * @fileoverview Operation DataprevQualificacao — Infosimples API.
 * Endpoint: POST consultas/dataprev/qualificacao
 * @module infrastructure/providers/infosimples/operations/DataprevQualificacao
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type DataprevQualificacaoItem,
  DataprevQualificacaoResponseSchema,
} from '../dtos/DataprevQualificacaoDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class DataprevQualificacao implements IInfosimplesOperation<DataprevQualificacaoItem> {
  readonly path = 'consultas/dataprev/qualificacao';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, DataprevQualificacaoItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(DataprevQualificacaoResponseSchema, result.value, 'infosimples');
  }
}
