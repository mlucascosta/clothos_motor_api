/**
 * @fileoverview Operation ProprietarioAtualV2 — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/ProprietarioAtualV2
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { ProprietarioAtualV2Schema } from '../dtos/ProprietarioAtualV2Dto.js';
import type { ProprietarioAtualV2Dto } from '../dtos/ProprietarioAtualV2Dto.js';
import type { IProprietarioAtualV2 } from '../ports/IProprietarioAtualV2.js';

export class ProprietarioAtualV2 implements IProprietarioAtualV2 {
  readonly path = '/proprietario-atual-v2';
  readonly creditValue = 6.75;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ProprietarioAtualV2Dto>> {
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

    return parseOrSchemaError(ProprietarioAtualV2Schema, result.value, 'apibrasil');
  }
}
