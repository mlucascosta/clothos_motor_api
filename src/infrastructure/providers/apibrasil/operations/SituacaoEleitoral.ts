/**
 * @fileoverview Operation SituacaoEleitoral — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/SituacaoEleitoral
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { SituacaoEleitoralSchema } from '../dtos/SituacaoEleitoralDto.js';
import type { SituacaoEleitoralDto } from '../dtos/SituacaoEleitoralDto.js';
import type { ISituacaoEleitoral } from '../ports/ISituacaoEleitoral.js';

export class SituacaoEleitoral implements ISituacaoEleitoral {
  readonly path = '/dados/cpf';
  readonly creditValue = 0.66;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SituacaoEleitoralDto>> {
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

    return parseOrSchemaError(SituacaoEleitoralSchema, result.value, 'apibrasil');
  }
}
