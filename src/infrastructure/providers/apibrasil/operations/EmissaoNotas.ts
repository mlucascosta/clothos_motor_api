/**
 * @fileoverview Operation EmissaoNotas — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/EmissaoNotas
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { EmissaoNotasSchema } from '../dtos/EmissaoNotasDto.js';
import type { IEmissaoNotas } from '../ports/IEmissaoNotas.js';

export class EmissaoNotas implements IEmissaoNotas {
  readonly path = '/emissao-notas';
  readonly creditValue = 0.5;
  readonly type = 'generic';

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

    return parseOrSchemaError(EmissaoNotasSchema, result.value, 'apibrasil');
  }
}
