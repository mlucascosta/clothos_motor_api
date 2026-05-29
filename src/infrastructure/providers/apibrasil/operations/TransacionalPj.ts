/**
 * @fileoverview Operation TransacionalPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/TransacionalPj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { TransacionalPjSchema } from '../dtos/TransacionalPjDto.js';
import type { TransacionalPjDto } from '../dtos/TransacionalPjDto.js';
import type { ITransacionalPj } from '../ports/ITransacionalPj.js';

export class TransacionalPj implements ITransacionalPj {
  readonly path = '/transacional-pj';
  readonly creditValue = 0.6;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, TransacionalPjDto>> {
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

    return parseOrSchemaError(TransacionalPjSchema, result.value, 'apibrasil');
  }
}
