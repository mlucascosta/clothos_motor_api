/**
 * @fileoverview Operation DataprevFap — Infosimples API.
 * Endpoint: POST consultas/dataprev/fap
 * @module infrastructure/providers/infosimples/operations/DataprevFap
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { DataprevFapResponseSchema, type DataprevFapItem } from '../dtos/DataprevFapDto.js';

export class DataprevFap implements IInfosimplesOperation<DataprevFapItem> {
  readonly path = 'consultas/dataprev/fap';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, DataprevFapItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, { method: 'POST', params: cleanParams });
    if (isLeft(result)) return result;
    return parseOrSchemaError(DataprevFapResponseSchema, result.value, 'infosimples');
  }
}
