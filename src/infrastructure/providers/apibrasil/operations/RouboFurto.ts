/**
 * @fileoverview Operation RouboFurto — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/RouboFurto
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { RouboFurtoSchema } from '../dtos/RouboFurtoDto.js';
import type { RouboFurtoDto } from '../dtos/RouboFurtoDto.js';
import type { IRouboFurto } from '../ports/IRouboFurto.js';

export class RouboFurto implements IRouboFurto {
  readonly path = '/vehicles/dados';
  readonly creditValue = 3.86;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RouboFurtoDto>> {
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

    return parseOrSchemaError(RouboFurtoSchema, result.value, 'apibrasil');
  }
}
