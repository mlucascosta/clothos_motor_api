/**
 * @fileoverview Operation RouboFurtoV2 — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/RouboFurtoV2
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { RouboFurtoV2Schema } from '../dtos/RouboFurtoV2Dto.js';
import type { IRouboFurtoV2 } from '../ports/IRouboFurtoV2.js';

export class RouboFurtoV2 implements IRouboFurtoV2 {
  readonly path = '/vehicles/dados';
  readonly creditValue = 12.5;
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

    return parseOrSchemaError(RouboFurtoV2Schema, result.value, 'apibrasil');
  }
}
