/**
 * @fileoverview Operation CreditosSimplesPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CreditosSimplesPj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { CreditosSimplesPjSchema } from '../dtos/CreditosSimplesPjDto.js';
import type { CreditosSimplesPjDto } from '../dtos/CreditosSimplesPjDto.js';
import type { ICreditosSimplesPj } from '../ports/ICreditosSimplesPj.js';

export class CreditosSimplesPj implements ICreditosSimplesPj {
  readonly path = '/creditos-simples-pj';
  readonly creditValue = 14.96;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CreditosSimplesPjDto>> {
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

    return parseOrSchemaError(CreditosSimplesPjSchema, result.value, 'apibrasil');
  }
}
