/**
 * @fileoverview Operation DebitosRestricoes — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/DebitosRestricoes
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { DebitosRestricoesSchema } from '../dtos/DebitosRestricoesDto.js';
import type { DebitosRestricoesDto } from '../dtos/DebitosRestricoesDto.js';
import type { IDebitosRestricoes } from '../ports/IDebitosRestricoes.js';

export class DebitosRestricoes implements IDebitosRestricoes {
  readonly path = '/debitos-restricoes';
  readonly creditValue = 4.79;
  readonly type = 'vehicles';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, DebitosRestricoesDto>> {
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

    return parseOrSchemaError(DebitosRestricoesSchema, result.value, 'apibrasil');
  }
}
