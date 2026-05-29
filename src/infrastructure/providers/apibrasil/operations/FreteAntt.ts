/**
 * @fileoverview Operation FreteAntt — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/FreteAntt
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { FreteAnttSchema } from '../dtos/FreteAnttDto.js';
import type { IFreteAntt } from '../ports/IFreteAntt.js';

export class FreteAntt implements IFreteAntt {
  readonly path = '/frete-antt';
  readonly creditValue = 0.05;
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

    return parseOrSchemaError(FreteAnttSchema, result.value, 'apibrasil');
  }
}
