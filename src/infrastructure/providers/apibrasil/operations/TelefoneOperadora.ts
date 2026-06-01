/**
 * @fileoverview Operation TelefoneOperadora — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/TelefoneOperadora
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { TelefoneOperadoraSchema } from '../dtos/TelefoneOperadoraDto.js';
import type { TelefoneOperadoraDto } from '../dtos/TelefoneOperadoraDto.js';
import type { ITelefoneOperadora } from '../ports/ITelefoneOperadora.js';

export class TelefoneOperadora implements ITelefoneOperadora {
  readonly path = '/vehicles/dados';
  readonly creditValue = 0.04;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, TelefoneOperadoraDto>> {
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

    return parseOrSchemaError(TelefoneOperadoraSchema, result.value, 'apibrasil');
  }
}
