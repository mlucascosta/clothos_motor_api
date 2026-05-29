/**
 * @fileoverview Operation ReceitaFederal — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/ReceitaFederal
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { ReceitaFederalSchema } from '../dtos/ReceitaFederalDto.js';
import type { IReceitaFederal } from '../ports/IReceitaFederal.js';

export class ReceitaFederal implements IReceitaFederal {
  readonly path = '/dados/cpf';
  readonly creditValue = 0.34;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>> {
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

    return parseOrSchemaError(ReceitaFederalSchema, result.value, 'apibrasil');
  }
}
