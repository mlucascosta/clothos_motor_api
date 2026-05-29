/**
 * @fileoverview Operation VeiculosDocumentoPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/VeiculosDocumentoPj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { VeiculosDocumentoPjSchema } from '../dtos/VeiculosDocumentoPjDto.js';
import type { IVeiculosDocumentoPj } from '../ports/IVeiculosDocumentoPj.js';

export class VeiculosDocumentoPj implements IVeiculosDocumentoPj {
  readonly path = '/veiculos-documento-pj';
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

    return parseOrSchemaError(VeiculosDocumentoPjSchema, result.value, 'apibrasil');
  }
}
