/**
 * @fileoverview Operation FichaTecnica — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/FichaTecnica
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { FichaTecnicaSchema } from '../dtos/FichaTecnicaDto.js';
import type { FichaTecnicaDto } from '../dtos/FichaTecnicaDto.js';
import type { IFichaTecnica } from '../ports/IFichaTecnica.js';

export class FichaTecnica implements IFichaTecnica {
  readonly path = '/ficha-tecnica';
  readonly creditValue = 2.98;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, FichaTecnicaDto>> {
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

    return parseOrSchemaError(FichaTecnicaSchema, result.value, 'apibrasil');
  }
}
