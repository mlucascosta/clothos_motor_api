/**
 * @fileoverview Operation Rastreio — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/Rastreio
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { RastreioSchema } from '../dtos/RastreioDto.js';
import type { RastreioDto } from '../dtos/RastreioDto.js';
import type { IRastreio } from '../ports/IRastreio.js';

export class Rastreio implements IRastreio {
  readonly path = '/rastreio';
  readonly creditValue = 0.04;
  readonly type = 'generic';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RastreioDto>> {
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

    return parseOrSchemaError(RastreioSchema, result.value, 'apibrasil');
  }
}
