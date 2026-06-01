/**
 * @fileoverview Operation ProtestoNacionalV2 — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/ProtestoNacionalV2
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { ProtestoNacionalV2Schema } from '../dtos/ProtestoNacionalV2Dto.js';
import type { ProtestoNacionalV2Dto } from '../dtos/ProtestoNacionalV2Dto.js';
import type { IProtestoNacionalV2 } from '../ports/IProtestoNacionalV2.js';

export class ProtestoNacionalV2 implements IProtestoNacionalV2 {
  readonly path = '/protesto-nacional-v2';
  readonly creditValue = 20.85;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ProtestoNacionalV2Dto>> {
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

    return parseOrSchemaError(ProtestoNacionalV2Schema, result.value, 'apibrasil');
  }
}
