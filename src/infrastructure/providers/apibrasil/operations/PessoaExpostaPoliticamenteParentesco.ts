/**
 * @fileoverview Operation PessoaExpostaPoliticamenteParentesco — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/PessoaExpostaPoliticamenteParentesco
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { PessoaExpostaPoliticamenteParentescoSchema } from '../dtos/PessoaExpostaPoliticamenteParentescoDto.js';
import type { PessoaExpostaPoliticamenteParentescoDto } from '../dtos/PessoaExpostaPoliticamenteParentescoDto.js';
import type { IPessoaExpostaPoliticamenteParentesco } from '../ports/IPessoaExpostaPoliticamenteParentesco.js';

export class PessoaExpostaPoliticamenteParentesco implements IPessoaExpostaPoliticamenteParentesco {
  readonly path = '/dados/cpf';
  readonly creditValue = 0.66;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PessoaExpostaPoliticamenteParentescoDto>> {
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

    return parseOrSchemaError(PessoaExpostaPoliticamenteParentescoSchema, result.value, 'apibrasil');
  }
}
