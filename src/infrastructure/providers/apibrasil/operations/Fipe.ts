/**
 * @fileoverview Operation Fipe — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/Fipe
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { FipeSchema } from '../dtos/FipeDto.js';
import type { FipeDto } from '../dtos/FipeDto.js';
import type { IFipe } from '../ports/IFipe.js';

export class Fipe implements IFipe {
  readonly path = '/fipe';
  readonly creditValue = 0.06;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, FipeDto>> {
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

    return parseOrSchemaError(FipeSchema, result.value, 'apibrasil');
  }
}
