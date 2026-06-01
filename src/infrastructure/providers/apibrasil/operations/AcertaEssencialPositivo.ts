/**
 * @fileoverview Operation AcertaEssencialPositivo — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/AcertaEssencialPositivo
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { AcertaEssencialPositivoSchema } from '../dtos/AcertaEssencialPositivoDto.js';
import type { AcertaEssencialPositivoDto } from '../dtos/AcertaEssencialPositivoDto.js';
import type { IAcertaEssencialPositivo } from '../ports/IAcertaEssencialPositivo.js';

export class AcertaEssencialPositivo implements IAcertaEssencialPositivo {
  readonly path = '/acerta-essencial-positivo';
  readonly creditValue = 4.49;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AcertaEssencialPositivoDto>> {
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

    return parseOrSchemaError(AcertaEssencialPositivoSchema, result.value, 'apibrasil');
  }
}
