/**
 * @fileoverview Operation ReceitaFederalPjV3 — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/ReceitaFederalPjV3
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { ReceitaFederalPjV3Schema } from '../dtos/ReceitaFederalPjV3Dto.js';
import type { ReceitaFederalPjV3Dto } from '../dtos/ReceitaFederalPjV3Dto.js';
import type { IReceitaFederalPjV3 } from '../ports/IReceitaFederalPjV3.js';

export class ReceitaFederalPjV3 implements IReceitaFederalPjV3 {
  readonly path = '/receita-federal-pj-v3';
  readonly creditValue = 6.35;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ReceitaFederalPjV3Dto>> {
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

    return parseOrSchemaError(ReceitaFederalPjV3Schema, result.value, 'apibrasil');
  }
}
