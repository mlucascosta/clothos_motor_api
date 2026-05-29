/**
 * @fileoverview Operation CnpjSearch — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CnpjSearch
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { CnpjSearchSchema } from '../dtos/CnpjSearchDto.js';
import type { ICnpjSearch } from '../ports/ICnpjSearch.js';

export class CnpjSearch implements ICnpjSearch {
  readonly path = '/cnpj-search';
  readonly creditValue = 1.6;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>> {
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    }

    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      body: cleanParams,
    });

    if (isLeft(result)) return result;

    return parseOrSchemaError(CnpjSearchSchema, result.value, 'apibrasil');
  }
}
