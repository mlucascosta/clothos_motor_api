/**
 * @fileoverview Operation RiscoPositivoPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/RiscoPositivoPj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { RiscoPositivoPjSchema } from '../dtos/RiscoPositivoPjDto.js';
import type { RiscoPositivoPjDto } from '../dtos/RiscoPositivoPjDto.js';
import type { IRiscoPositivoPj } from '../ports/IRiscoPositivoPj.js';

export class RiscoPositivoPj implements IRiscoPositivoPj {
  readonly path = '/risco-positivo-pj';
  readonly creditValue = 4.0;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RiscoPositivoPjDto>> {
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

    return parseOrSchemaError(RiscoPositivoPjSchema, result.value, 'apibrasil');
  }
}
