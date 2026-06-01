/**
 * @fileoverview Operation SintegraCadastrosEstaduais — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/SintegraCadastrosEstaduais
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { SintegraCadastrosEstaduaisSchema } from '../dtos/SintegraCadastrosEstaduaisDto.js';
import type { SintegraCadastrosEstaduaisDto } from '../dtos/SintegraCadastrosEstaduaisDto.js';
import type { ISintegraCadastrosEstaduais } from '../ports/ISintegraCadastrosEstaduais.js';

export class SintegraCadastrosEstaduais implements ISintegraCadastrosEstaduais {
  readonly path = '/sintegra';
  readonly creditValue = 0.66;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SintegraCadastrosEstaduaisDto>> {
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

    return parseOrSchemaError(SintegraCadastrosEstaduaisSchema, result.value, 'apibrasil');
  }
}
