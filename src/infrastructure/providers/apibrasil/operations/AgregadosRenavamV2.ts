/**
 * @fileoverview Operation AgregadosRenavamV2 — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AgregadosRenavamV2
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { AgregadosRenavamV2Schema } from '../dtos/AgregadosRenavamV2Dto.js';
import type { AgregadosRenavamV2Dto } from '../dtos/AgregadosRenavamV2Dto.js';
import type { IAgregadosRenavamV2 } from '../ports/IAgregadosRenavamV2.js';

export class AgregadosRenavamV2 implements IAgregadosRenavamV2 {
  readonly path = '/vehicles/dados';
  readonly creditValue = 2.8;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AgregadosRenavamV2Dto>> {
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

    return parseOrSchemaError(AgregadosRenavamV2Schema, result.value, 'apibrasil');
  }
}
