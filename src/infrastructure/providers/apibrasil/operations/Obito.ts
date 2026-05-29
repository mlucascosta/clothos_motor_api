/**
 * @fileoverview Operation Obito — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/Obito
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { ObitoSchema } from '../dtos/ObitoDto.js';
import type { IObito } from '../ports/IObito.js';

export class Obito implements IObito {
  readonly path = '/vehicles/dados';
  readonly creditValue = 0.66;
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

    return parseOrSchemaError(ObitoSchema, result.value, 'apibrasil');
  }
}
