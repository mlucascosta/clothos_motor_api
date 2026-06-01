/**
 * @fileoverview Operation EnriquecimentoDeLead — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/EnriquecimentoDeLead
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { EnriquecimentoDeLeadSchema } from '../dtos/EnriquecimentoDeLeadDto.js';
import type { EnriquecimentoDeLeadDto } from '../dtos/EnriquecimentoDeLeadDto.js';
import type { IEnriquecimentoDeLead } from '../ports/IEnriquecimentoDeLead.js';

export class EnriquecimentoDeLead implements IEnriquecimentoDeLead {
  readonly path = '/dados/cpf';
  readonly creditValue = 3.66;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, EnriquecimentoDeLeadDto>> {
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

    return parseOrSchemaError(EnriquecimentoDeLeadSchema, result.value, 'apibrasil');
  }
}
