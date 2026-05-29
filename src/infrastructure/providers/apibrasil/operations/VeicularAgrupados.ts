/**
 * @fileoverview Operation VeicularAgrupados — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/VeicularAgrupados
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { VeicularAgrupadosSchema } from '../dtos/VeicularAgrupadosDto.js';
import type { VeicularAgrupadosDto } from '../dtos/VeicularAgrupadosDto.js';
import type { IVeicularAgrupados } from '../ports/IVeicularAgrupados.js';

export class VeicularAgrupados implements IVeicularAgrupados {
  readonly path = '/veicular-agrupados';
  readonly creditValue = 0.0;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, VeicularAgrupadosDto>> {
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

    return parseOrSchemaError(VeicularAgrupadosSchema, result.value, 'apibrasil');
  }
}
