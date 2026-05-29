/**
 * @fileoverview Operation Crbm — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/Crbm
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { CrbmSchema } from '../dtos/CrbmDto.js';
import type { CrbmDto } from '../dtos/CrbmDto.js';
import type { ICrbm } from '../ports/ICrbm.js';

export class Crbm implements ICrbm {
  readonly path = '/crbm';
  readonly creditValue = 0.4;
  readonly type = 'generic';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CrbmDto>> {
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

    return parseOrSchemaError(CrbmSchema, result.value, 'apibrasil');
  }
}
