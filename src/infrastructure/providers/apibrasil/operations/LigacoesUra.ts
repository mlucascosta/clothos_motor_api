/**
 * @fileoverview Operation LigacoesUra — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/LigacoesUra
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { LigacoesUraSchema } from '../dtos/LigacoesUraDto.js';
import type { LigacoesUraDto } from '../dtos/LigacoesUraDto.js';
import type { ILigacoesUra } from '../ports/ILigacoesUra.js';

export class LigacoesUra implements ILigacoesUra {
  readonly path = '/vehicles/dados';
  readonly creditValue = 0.25;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, LigacoesUraDto>> {
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

    return parseOrSchemaError(LigacoesUraSchema, result.value, 'apibrasil');
  }
}
