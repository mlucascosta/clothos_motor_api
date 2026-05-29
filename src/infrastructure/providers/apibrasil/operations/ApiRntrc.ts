/**
 * @fileoverview Operation ApiRntrc — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/ApiRntrc
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { ApiRntrcSchema } from '../dtos/ApiRntrcDto.js';
import type { IApiRntrc } from '../ports/IApiRntrc.js';

export class ApiRntrc implements IApiRntrc {
  readonly path = '/api-rntrc';
  readonly creditValue = 0.02;
  readonly type = 'generic';

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

    return parseOrSchemaError(ApiRntrcSchema, result.value, 'apibrasil');
  }
}
