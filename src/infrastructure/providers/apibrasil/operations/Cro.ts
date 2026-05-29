/**
 * @fileoverview Operation Cro — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/Cro
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { CroSchema } from '../dtos/CroDto.js';
import type { ICro } from '../ports/ICro.js';

export class Cro implements ICro {
  readonly path = '/cro';
  readonly creditValue = 0.4;
  readonly type = 'generic';

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

    return parseOrSchemaError(CroSchema, result.value, 'apibrasil');
  }
}
