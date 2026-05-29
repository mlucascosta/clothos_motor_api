/**
 * @fileoverview Operation AgregadosIndicioSinistro — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AgregadosIndicioSinistro
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { AgregadosIndicioSinistroSchema } from '../dtos/AgregadosIndicioSinistroDto.js';
import type { IAgregadosIndicioSinistro } from '../ports/IAgregadosIndicioSinistro.js';

export class AgregadosIndicioSinistro implements IAgregadosIndicioSinistro {
  readonly path = '/agregados-indicio-sinistro';
  readonly creditValue = 3.84;
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

    return parseOrSchemaError(AgregadosIndicioSinistroSchema, result.value, 'apibrasil');
  }
}
