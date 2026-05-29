/**
 * @fileoverview Operation GravameV2 — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/GravameV2
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { GravameV2Schema } from '../dtos/GravameV2Dto.js';
import type { IGravameV2 } from '../ports/IGravameV2.js';

export class GravameV2 implements IGravameV2 {
  readonly path = '/vehicles/dados';
  readonly creditValue = 11.75;
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

    return parseOrSchemaError(GravameV2Schema, result.value, 'apibrasil');
  }
}
