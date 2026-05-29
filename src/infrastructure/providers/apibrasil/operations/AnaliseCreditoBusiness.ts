/**
 * @fileoverview Operation AnaliseCreditoBusiness — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AnaliseCreditoBusiness
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { AnaliseCreditoBusinessSchema } from '../dtos/AnaliseCreditoBusinessDto.js';
import type { IAnaliseCreditoBusiness } from '../ports/IAnaliseCreditoBusiness.js';

export class AnaliseCreditoBusiness implements IAnaliseCreditoBusiness {
  readonly path = '/analise-credito-business';
  readonly creditValue = 55.8;
  readonly type = 'cnpj';

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

    return parseOrSchemaError(AnaliseCreditoBusinessSchema, result.value, 'apibrasil');
  }
}
