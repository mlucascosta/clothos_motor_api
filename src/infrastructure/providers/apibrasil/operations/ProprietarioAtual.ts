/**
 * @fileoverview Operation ProprietarioAtual — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/ProprietarioAtual
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { ProprietarioAtualSchema } from '../dtos/ProprietarioAtualDto.js';
import type { ProprietarioAtualDto } from '../dtos/ProprietarioAtualDto.js';
import type { IProprietarioAtual } from '../ports/IProprietarioAtual.js';

export class ProprietarioAtual implements IProprietarioAtual {
  readonly path = '/vehicles/dados';
  readonly creditValue = 0.7;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ProprietarioAtualDto>> {
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

    return parseOrSchemaError(ProprietarioAtualSchema, result.value, 'apibrasil');
  }
}
