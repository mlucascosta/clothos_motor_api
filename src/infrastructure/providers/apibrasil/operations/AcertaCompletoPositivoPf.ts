/**
 * @fileoverview Operation AcertaCompletoPositivoPf — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AcertaCompletoPositivoPf
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { AcertaCompletoPositivoPfSchema } from '../dtos/AcertaCompletoPositivoPfDto.js';
import type { IAcertaCompletoPositivoPf } from '../ports/IAcertaCompletoPositivoPf.js';

export class AcertaCompletoPositivoPf implements IAcertaCompletoPositivoPf {
  readonly path = '/acerta-completo-positivo-pf';
  readonly creditValue = 24.9;
  readonly type = 'cpf';

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

    return parseOrSchemaError(AcertaCompletoPositivoPfSchema, result.value, 'apibrasil');
  }
}
