/**
 * @fileoverview Operation LimitePj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/LimitePj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { LimitePjSchema } from '../dtos/LimitePjDto.js';
import type { LimitePjDto } from '../dtos/LimitePjDto.js';
import type { ILimitePj } from '../ports/ILimitePj.js';

export class LimitePj implements ILimitePj {
  readonly path = '/limite-pj';
  readonly creditValue = 10.79;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, LimitePjDto>> {
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

    return parseOrSchemaError(LimitePjSchema, result.value, 'apibrasil');
  }
}
