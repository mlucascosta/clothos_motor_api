/**
 * @fileoverview Operation AntecedentesCriminais — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AntecedentesCriminais
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { AntecedentesCriminaisSchema } from '../dtos/AntecedentesCriminaisDto.js';
import type { AntecedentesCriminaisDto } from '../dtos/AntecedentesCriminaisDto.js';
import type { IAntecedentesCriminais } from '../ports/IAntecedentesCriminais.js';

export class AntecedentesCriminais implements IAntecedentesCriminais {
  readonly path = '/antecedentes-criminais';
  readonly creditValue = 0.79;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AntecedentesCriminaisDto>> {
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

    return parseOrSchemaError(AntecedentesCriminaisSchema, result.value, 'apibrasil');
  }
}
