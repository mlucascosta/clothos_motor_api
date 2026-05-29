/**
 * @fileoverview Operation DebitosV4 — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/DebitosV4
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { DebitosV4Schema } from '../dtos/DebitosV4Dto.js';
import type { DebitosV4Dto } from '../dtos/DebitosV4Dto.js';
import type { IDebitosV4 } from '../ports/IDebitosV4.js';

export class DebitosV4 implements IDebitosV4 {
  readonly path = '/debitos-v4';
  readonly creditValue = 8.0;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, DebitosV4Dto>> {
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

    return parseOrSchemaError(DebitosV4Schema, result.value, 'apibrasil');
  }
}
