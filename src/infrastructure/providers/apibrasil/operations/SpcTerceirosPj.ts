/**
 * @fileoverview Operation SpcTerceirosPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/SpcTerceirosPj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { SpcTerceirosPjSchema } from '../dtos/SpcTerceirosPjDto.js';
import type { SpcTerceirosPjDto } from '../dtos/SpcTerceirosPjDto.js';
import type { ISpcTerceirosPj } from '../ports/ISpcTerceirosPj.js';

export class SpcTerceirosPj implements ISpcTerceirosPj {
  readonly path = '/spc-terceiros-pj';
  readonly creditValue = 13.8;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SpcTerceirosPjDto>> {
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

    return parseOrSchemaError(SpcTerceirosPjSchema, result.value, 'apibrasil');
  }
}
