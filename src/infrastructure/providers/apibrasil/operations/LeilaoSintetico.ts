/**
 * @fileoverview Operation LeilaoSintetico — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/LeilaoSintetico
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { LeilaoSinteticoSchema } from '../dtos/LeilaoSinteticoDto.js';
import type { LeilaoSinteticoDto } from '../dtos/LeilaoSinteticoDto.js';
import type { ILeilaoSintetico } from '../ports/ILeilaoSintetico.js';

export class LeilaoSintetico implements ILeilaoSintetico {
  readonly path = '/vehicles/dados';
  readonly creditValue = 18.4;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, LeilaoSinteticoDto>> {
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

    return parseOrSchemaError(LeilaoSinteticoSchema, result.value, 'apibrasil');
  }
}
