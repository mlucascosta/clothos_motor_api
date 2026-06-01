/**
 * @fileoverview Operation HistoricoVeiculosPfPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/HistoricoVeiculosPfPj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { HistoricoVeiculosPfPjSchema } from '../dtos/HistoricoVeiculosPfPjDto.js';
import type { HistoricoVeiculosPfPjDto } from '../dtos/HistoricoVeiculosPfPjDto.js';
import type { IHistoricoVeiculosPfPj } from '../ports/IHistoricoVeiculosPfPj.js';

export class HistoricoVeiculosPfPj implements IHistoricoVeiculosPfPj {
  readonly path = '/vehicles/dados';
  readonly creditValue = 0.72;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, HistoricoVeiculosPfPjDto>> {
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

    return parseOrSchemaError(HistoricoVeiculosPfPjSchema, result.value, 'apibrasil');
  }
}
