/**
 * @fileoverview Operation RelatorioPositivo — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/RelatorioPositivo
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { RelatorioPositivoSchema } from '../dtos/RelatorioPositivoDto.js';
import type { IRelatorioPositivo } from '../ports/IRelatorioPositivo.js';

export class RelatorioPositivo implements IRelatorioPositivo {
  readonly path = '/relatorio-positivo';
  readonly creditValue = 36.3;
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

    return parseOrSchemaError(RelatorioPositivoSchema, result.value, 'apibrasil');
  }
}
