/**
 * @fileoverview Operation Crm — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/Crm
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { CrmSchema } from '../dtos/CrmDto.js';
import type { ICrm } from '../ports/ICrm.js';

export class Crm implements ICrm {
  readonly path = '/crm';
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

    return parseOrSchemaError(CrmSchema, result.value, 'apibrasil');
  }
}
