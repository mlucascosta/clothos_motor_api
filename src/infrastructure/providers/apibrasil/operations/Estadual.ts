/**
 * @fileoverview Operation Estadual — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/Estadual
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { EstadualSchema } from '../dtos/EstadualDto.js';
import type { EstadualDto } from '../dtos/EstadualDto.js';
import type { IEstadual } from '../ports/IEstadual.js';

export class Estadual implements IEstadual {
  readonly path = '/vehicles/dados';
  readonly creditValue = 2.5;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, EstadualDto>> {
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

    return parseOrSchemaError(EstadualSchema, result.value, 'apibrasil');
  }
}
