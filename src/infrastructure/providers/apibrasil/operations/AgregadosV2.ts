/**
 * @fileoverview Operation AgregadosV2 — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AgregadosV2
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { AgregadosV2Schema } from '../dtos/AgregadosV2Dto.js';
import type { IAgregadosV2 } from '../ports/IAgregadosV2.js';

export class AgregadosV2 implements IAgregadosV2 {
  readonly path = '/vehicles/dados';
  readonly creditValue = 0.6;
  readonly type = 'vehicles';

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

    return parseOrSchemaError(AgregadosV2Schema, result.value, 'apibrasil');
  }
}
