/**
 * @fileoverview Operation CertidaoNegativaDeDebitosPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CertidaoNegativaDeDebitosPj
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { CertidaoNegativaDeDebitosPjSchema } from '../dtos/CertidaoNegativaDeDebitosPjDto.js';
import type { ICertidaoNegativaDeDebitosPj } from '../ports/ICertidaoNegativaDeDebitosPj.js';

export class CertidaoNegativaDeDebitosPj implements ICertidaoNegativaDeDebitosPj {
  readonly path = '/certidao-negativa-de-debitos-pj';
  readonly creditValue = 1.8;
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

    return parseOrSchemaError(CertidaoNegativaDeDebitosPjSchema, result.value, 'apibrasil');
  }
}
