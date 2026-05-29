/**
 * @fileoverview Operation LimitePositivoPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/LimitePositivoPj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { LimitePositivoPjSchema } from '../dtos/LimitePositivoPjDto.js';
import type { ILimitePositivoPj } from '../ports/ILimitePositivoPj.js';

export class LimitePositivoPj implements ILimitePositivoPj {
  readonly path = '/limite-positivo-pj';
  readonly creditValue = 12.39;
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

    return parseOrSchemaError(LimitePositivoPjSchema, result.value, 'apibrasil');
  }
}
