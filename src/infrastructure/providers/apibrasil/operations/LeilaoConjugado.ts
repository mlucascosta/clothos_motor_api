/**
 * @fileoverview Operation LeilaoConjugado — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/LeilaoConjugado
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { LeilaoConjugadoSchema } from '../dtos/LeilaoConjugadoDto.js';
import type { LeilaoConjugadoDto } from '../dtos/LeilaoConjugadoDto.js';
import type { ILeilaoConjugado } from '../ports/ILeilaoConjugado.js';

export class LeilaoConjugado implements ILeilaoConjugado {
  readonly path = '/leilao-conjugado';
  readonly creditValue = 27.52;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, LeilaoConjugadoDto>> {
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

    return parseOrSchemaError(LeilaoConjugadoSchema, result.value, 'apibrasil');
  }
}
