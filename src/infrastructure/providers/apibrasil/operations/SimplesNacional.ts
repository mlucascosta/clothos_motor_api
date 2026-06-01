/**
 * @fileoverview Operation SimplesNacional — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/SimplesNacional
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { SimplesNacionalSchema } from '../dtos/SimplesNacionalDto.js';
import type { SimplesNacionalDto } from '../dtos/SimplesNacionalDto.js';
import type { ISimplesNacional } from '../ports/ISimplesNacional.js';

export class SimplesNacional implements ISimplesNacional {
  readonly path = '/dados/cpf';
  readonly creditValue = 0.66;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SimplesNacionalDto>> {
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

    return parseOrSchemaError(SimplesNacionalSchema, result.value, 'apibrasil');
  }
}
