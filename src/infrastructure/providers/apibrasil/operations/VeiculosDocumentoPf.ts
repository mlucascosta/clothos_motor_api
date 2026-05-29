/**
 * @fileoverview Operation VeiculosDocumentoPf — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/VeiculosDocumentoPf
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { VeiculosDocumentoPfSchema } from '../dtos/VeiculosDocumentoPfDto.js';
import type { IVeiculosDocumentoPf } from '../ports/IVeiculosDocumentoPf.js';

export class VeiculosDocumentoPf implements IVeiculosDocumentoPf {
  readonly path = '/veiculos-documento-pf';
  readonly creditValue = 9.5;
  readonly type = 'vehicles';

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

    return parseOrSchemaError(VeiculosDocumentoPfSchema, result.value, 'apibrasil');
  }
}
