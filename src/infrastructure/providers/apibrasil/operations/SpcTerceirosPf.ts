/**
 * @fileoverview Operation SpcTerceirosPf — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/SpcTerceirosPf
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { SpcTerceirosPfSchema } from '../dtos/SpcTerceirosPfDto.js';
import type { SpcTerceirosPfDto } from '../dtos/SpcTerceirosPfDto.js';
import type { ISpcTerceirosPf } from '../ports/ISpcTerceirosPf.js';

export class SpcTerceirosPf implements ISpcTerceirosPf {
  readonly path = '/spc-terceiros-pf';
  readonly creditValue = 13.8;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SpcTerceirosPfDto>> {
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

    return parseOrSchemaError(SpcTerceirosPfSchema, result.value, 'apibrasil');
  }
}
