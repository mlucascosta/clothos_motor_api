/**
 * @fileoverview Operation BaseNacionalV2 — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/BaseNacionalV2
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { BaseNacionalV2Schema } from '../dtos/BaseNacionalV2Dto.js';
import type { BaseNacionalV2Dto } from '../dtos/BaseNacionalV2Dto.js';
import type { IBaseNacionalV2 } from '../ports/IBaseNacionalV2.js';

export class BaseNacionalV2 implements IBaseNacionalV2 {
  readonly path = '/vehicles/dados';
  readonly creditValue = 3.2;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, BaseNacionalV2Dto>> {
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

    return parseOrSchemaError(BaseNacionalV2Schema, result.value, 'apibrasil');
  }
}
