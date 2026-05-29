/**
 * @fileoverview Operation CnhCriminals — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CnhCriminals
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { CnhCriminalsSchema } from '../dtos/CnhCriminalsDto.js';
import type { ICnhCriminals } from '../ports/ICnhCriminals.js';

export class CnhCriminals implements ICnhCriminals {
  readonly path = '/cnh-criminals';
  readonly creditValue = 4.7;
  readonly type = 'cnh';

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

    return parseOrSchemaError(CnhCriminalsSchema, result.value, 'apibrasil');
  }
}
