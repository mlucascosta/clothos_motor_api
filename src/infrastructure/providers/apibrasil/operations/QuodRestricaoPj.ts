/**
 * @fileoverview Operation QuodRestricaoPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/QuodRestricaoPj
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { QuodRestricaoPjSchema } from '../dtos/QuodRestricaoPjDto.js';
import type { IQuodRestricaoPj } from '../ports/IQuodRestricaoPj.js';

export class QuodRestricaoPj implements IQuodRestricaoPj {
  readonly path = '/dados/cnae';
  readonly creditValue = 6.5;
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

    return parseOrSchemaError(QuodRestricaoPjSchema, result.value, 'apibrasil');
  }
}
