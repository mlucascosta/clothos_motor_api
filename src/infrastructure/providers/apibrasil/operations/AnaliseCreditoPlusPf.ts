/**
 * @fileoverview Operation AnaliseCreditoPlusPf — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AnaliseCreditoPlusPf
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { AnaliseCreditoPlusPfSchema } from '../dtos/AnaliseCreditoPlusPfDto.js';
import type { AnaliseCreditoPlusPfDto } from '../dtos/AnaliseCreditoPlusPfDto.js';
import type { IAnaliseCreditoPlusPf } from '../ports/IAnaliseCreditoPlusPf.js';

export class AnaliseCreditoPlusPf implements IAnaliseCreditoPlusPf {
  readonly path = '/analise-credito-plus-pf';
  readonly creditValue = 29.02;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AnaliseCreditoPlusPfDto>> {
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

    return parseOrSchemaError(AnaliseCreditoPlusPfSchema, result.value, 'apibrasil');
  }
}
