/**
 * @fileoverview Operation CpfObitoGrupoCadastral — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CpfObitoGrupoCadastral
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { CpfObitoGrupoCadastralSchema } from '../dtos/CpfObitoGrupoCadastralDto.js';
import type { CpfObitoGrupoCadastralDto } from '../dtos/CpfObitoGrupoCadastralDto.js';
import type { ICpfObitoGrupoCadastral } from '../ports/ICpfObitoGrupoCadastral.js';

export class CpfObitoGrupoCadastral implements ICpfObitoGrupoCadastral {
  readonly path = '/dados/cpf';
  readonly creditValue = 0.58;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CpfObitoGrupoCadastralDto>> {
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

    return parseOrSchemaError(CpfObitoGrupoCadastralSchema, result.value, 'apibrasil');
  }
}
