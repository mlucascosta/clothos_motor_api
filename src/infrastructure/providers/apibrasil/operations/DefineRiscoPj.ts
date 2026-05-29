/**
 * @fileoverview Operation DefineRiscoPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/DefineRiscoPj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { DefineRiscoPjSchema } from '../dtos/DefineRiscoPjDto.js';
import type { IDefineRiscoPj } from '../ports/IDefineRiscoPj.js';

export class DefineRiscoPj implements IDefineRiscoPj {
  readonly path = '/define-risco-pj';
  readonly creditValue = 3.58;
  readonly type = 'cnpj';

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

    return parseOrSchemaError(DefineRiscoPjSchema, result.value, 'apibrasil');
  }
}
