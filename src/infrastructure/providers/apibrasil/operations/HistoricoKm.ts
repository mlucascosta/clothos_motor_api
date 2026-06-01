/**
 * @fileoverview Operation HistoricoKm — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/HistoricoKm
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { HistoricoKmSchema } from '../dtos/HistoricoKmDto.js';
import type { HistoricoKmDto } from '../dtos/HistoricoKmDto.js';
import type { IHistoricoKm } from '../ports/IHistoricoKm.js';

export class HistoricoKm implements IHistoricoKm {
  readonly path = '/vehicles/dados';
  readonly creditValue = 2.5;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, HistoricoKmDto>> {
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

    return parseOrSchemaError(HistoricoKmSchema, result.value, 'apibrasil');
  }
}
