/**
 * @fileoverview Operation CpfLite — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CpfLite
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { CpfLiteSchema } from '../dtos/CpfLiteDto.js';
import type { CpfLiteDto } from '../dtos/CpfLiteDto.js';
import type { ICpfLite } from '../ports/ICpfLite.js';

export class CpfLite implements ICpfLite {
  readonly path = '/dados/cpf';
  readonly creditValue = 0.12;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CpfLiteDto>> {
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

    return parseOrSchemaError(CpfLiteSchema, result.value, 'apibrasil');
  }
}
