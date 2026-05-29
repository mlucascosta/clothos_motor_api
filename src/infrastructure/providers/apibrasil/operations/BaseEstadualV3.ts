/**
 * @fileoverview Operation BaseEstadualV3 — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/BaseEstadualV3
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { BaseEstadualV3Schema } from '../dtos/BaseEstadualV3Dto.js';
import type { IBaseEstadualV3 } from '../ports/IBaseEstadualV3.js';

export class BaseEstadualV3 implements IBaseEstadualV3 {
  readonly path = '/vehicles/dados';
  readonly creditValue = 10.75;
  readonly type = 'vehicles';

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

    return parseOrSchemaError(BaseEstadualV3Schema, result.value, 'apibrasil');
  }
}
