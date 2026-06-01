/**
 * @fileoverview Operation QuodPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/QuodPj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { QuodPjSchema } from '../dtos/QuodPjDto.js';
import type { QuodPjDto } from '../dtos/QuodPjDto.js';
import type { IQuodPj } from '../ports/IQuodPj.js';

export class QuodPj implements IQuodPj {
  readonly path = '/quod-pj';
  readonly creditValue = 5.5;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, QuodPjDto>> {
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

    return parseOrSchemaError(QuodPjSchema, result.value, 'apibrasil');
  }
}
