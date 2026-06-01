/**
 * @fileoverview Operation AcoesProcessosJudiciais — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AcoesProcessosJudiciais
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { AcoesProcessosJudiciaisSchema } from '../dtos/AcoesProcessosJudiciaisDto.js';
import type { AcoesProcessosJudiciaisDto } from '../dtos/AcoesProcessosJudiciaisDto.js';
import type { IAcoesProcessosJudiciais } from '../ports/IAcoesProcessosJudiciais.js';

export class AcoesProcessosJudiciais implements IAcoesProcessosJudiciais {
  readonly path = '/acoes-processos-judiciais';
  readonly creditValue = 6.19;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AcoesProcessosJudiciaisDto>> {
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

    return parseOrSchemaError(AcoesProcessosJudiciaisSchema, result.value, 'apibrasil');
  }
}
