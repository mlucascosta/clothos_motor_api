/**
 * @fileoverview Operation AntifraudeChavePix — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AntifraudeChavePix
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { AntifraudeChavePixSchema } from '../dtos/AntifraudeChavePixDto.js';
import type { AntifraudeChavePixDto } from '../dtos/AntifraudeChavePixDto.js';
import type { IAntifraudeChavePix } from '../ports/IAntifraudeChavePix.js';

export class AntifraudeChavePix implements IAntifraudeChavePix {
  readonly path = '/dados/cpf';
  readonly creditValue = 3.49;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AntifraudeChavePixDto>> {
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

    return parseOrSchemaError(AntifraudeChavePixSchema, result.value, 'apibrasil');
  }
}
