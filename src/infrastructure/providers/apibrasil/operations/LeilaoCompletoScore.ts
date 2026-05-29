/**
 * @fileoverview Operation LeilaoCompletoScore — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/LeilaoCompletoScore
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { LeilaoCompletoScoreSchema } from '../dtos/LeilaoCompletoScoreDto.js';
import type { LeilaoCompletoScoreDto } from '../dtos/LeilaoCompletoScoreDto.js';
import type { ILeilaoCompletoScore } from '../ports/ILeilaoCompletoScore.js';

export class LeilaoCompletoScore implements ILeilaoCompletoScore {
  readonly path = '/vehicles/dados';
  readonly creditValue = 13.0;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, LeilaoCompletoScoreDto>> {
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

    return parseOrSchemaError(LeilaoCompletoScoreSchema, result.value, 'apibrasil');
  }
}
