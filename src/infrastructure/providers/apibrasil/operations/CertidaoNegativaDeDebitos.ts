/**
 * @fileoverview Operation CertidaoNegativaDeDebitos — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CertidaoNegativaDeDebitos
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { CertidaoNegativaDeDebitosSchema } from '../dtos/CertidaoNegativaDeDebitosDto.js';
import type { CertidaoNegativaDeDebitosDto } from '../dtos/CertidaoNegativaDeDebitosDto.js';
import type { ICertidaoNegativaDeDebitos } from '../ports/ICertidaoNegativaDeDebitos.js';

export class CertidaoNegativaDeDebitos implements ICertidaoNegativaDeDebitos {
  readonly path = '/certidao-negativa-de-debitos';
  readonly creditValue = 1.8;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CertidaoNegativaDeDebitosDto>> {
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

    return parseOrSchemaError(CertidaoNegativaDeDebitosSchema, result.value, 'apibrasil');
  }
}
