/**
 * @fileoverview Operation BancoCentralInabilitados — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/BancoCentralInabilitados
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { BancoCentralInabilitadosSchema } from '../dtos/BancoCentralInabilitadosDto.js';
import type { BancoCentralInabilitadosDto } from '../dtos/BancoCentralInabilitadosDto.js';
import type { IBancoCentralInabilitados } from '../ports/IBancoCentralInabilitados.js';

export class BancoCentralInabilitados implements IBancoCentralInabilitados {
  readonly path = '/banco-central-inabilitados';
  readonly creditValue = 1.5;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, BancoCentralInabilitadosDto>> {
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

    return parseOrSchemaError(BancoCentralInabilitadosSchema, result.value, 'apibrasil');
  }
}
