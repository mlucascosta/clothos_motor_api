/**
 * @fileoverview Operation DddAnatel — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/DddAnatel
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { DddAnatelSchema } from '../dtos/DddAnatelDto.js';
import type { DddAnatelDto } from '../dtos/DddAnatelDto.js';
import type { IDddAnatel } from '../ports/IDddAnatel.js';

export class DddAnatel implements IDddAnatel {
  readonly path = '/ddd';
  readonly creditValue = 0.03;
  readonly type = 'generic';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, DddAnatelDto>> {
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

    return parseOrSchemaError(DddAnatelSchema, result.value, 'apibrasil');
  }
}
