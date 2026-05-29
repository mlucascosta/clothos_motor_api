/**
 * @fileoverview Operation — IEPTB / Protestos Detalhes SP
 * Endpoint: POST consultas/ieptb/protestos/detalhes-sp
 * @module infrastructure/providers/infosimples/operations/IeptbProtestosDetalhes
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { IeptbProtestosDetalhesSpResponseSchema, type IeptbProtestosDetalhesSpItem } from '../dtos/IeptbProtestosDetalhesSpDto.js';

export class IeptbProtestosDetalhes implements IInfosimplesOperation<IeptbProtestosDetalhesSpItem> {
  readonly path = 'consultas/ieptb/protestos/detalhes-sp';
  readonly requiredParams = ['obter_detalhes'];

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, IeptbProtestosDetalhesSpItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(IeptbProtestosDetalhesSpResponseSchema, result.value, 'infosimples');
  }
}
