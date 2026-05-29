/**
 * @fileoverview Operation DecodificadorPrecificador — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/DecodificadorPrecificador
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { DecodificadorPrecificadorSchema } from '../dtos/DecodificadorPrecificadorDto.js';
import type { IDecodificadorPrecificador } from '../ports/IDecodificadorPrecificador.js';

export class DecodificadorPrecificador implements IDecodificadorPrecificador {
  readonly path = '/decodificador-precificador';
  readonly creditValue = 3.75;
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

    return parseOrSchemaError(DecodificadorPrecificadorSchema, result.value, 'apibrasil');
  }
}
