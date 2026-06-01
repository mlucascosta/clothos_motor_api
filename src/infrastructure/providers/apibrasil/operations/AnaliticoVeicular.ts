/**
 * @fileoverview Operation AnaliticoVeicular — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AnaliticoVeicular
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { AnaliticoVeicularSchema } from '../dtos/AnaliticoVeicularDto.js';
import type { AnaliticoVeicularDto } from '../dtos/AnaliticoVeicularDto.js';
import type { IAnaliticoVeicular } from '../ports/IAnaliticoVeicular.js';

export class AnaliticoVeicular implements IAnaliticoVeicular {
  readonly path = '/analitico-veicular';
  readonly creditValue = 0.14;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AnaliticoVeicularDto>> {
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

    return parseOrSchemaError(AnaliticoVeicularSchema, result.value, 'apibrasil');
  }
}
