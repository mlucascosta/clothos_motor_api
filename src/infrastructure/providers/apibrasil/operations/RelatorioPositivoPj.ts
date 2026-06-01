/**
 * @fileoverview Operation RelatorioPositivoPj — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/RelatorioPositivoPj
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { RelatorioPositivoPjSchema } from '../dtos/RelatorioPositivoPjDto.js';
import type { RelatorioPositivoPjDto } from '../dtos/RelatorioPositivoPjDto.js';
import type { IRelatorioPositivoPj } from '../ports/IRelatorioPositivoPj.js';

export class RelatorioPositivoPj implements IRelatorioPositivoPj {
  readonly path = '/relatorio-positivo-pj';
  readonly creditValue = 36.3;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RelatorioPositivoPjDto>> {
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

    return parseOrSchemaError(RelatorioPositivoPjSchema, result.value, 'apibrasil');
  }
}
