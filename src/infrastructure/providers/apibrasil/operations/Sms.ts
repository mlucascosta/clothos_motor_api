/**
 * @fileoverview Operation Sms — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/Sms
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { SmsSchema } from '../dtos/SmsDto.js';
import type { ISms } from '../ports/ISms.js';

export class Sms implements ISms {
  readonly path = '/sms';
  readonly creditValue = 0.1;
  readonly type = 'sms';

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

    return parseOrSchemaError(SmsSchema, result.value, 'apibrasil');
  }
}
