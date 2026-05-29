/**
 * @fileoverview Operation HistoricoAlteracoesEmpresa — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/HistoricoAlteracoesEmpresa
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { HistoricoAlteracoesEmpresaSchema } from '../dtos/HistoricoAlteracoesEmpresaDto.js';
import type { IHistoricoAlteracoesEmpresa } from '../ports/IHistoricoAlteracoesEmpresa.js';

export class HistoricoAlteracoesEmpresa implements IHistoricoAlteracoesEmpresa {
  readonly path = '/historico-alteracoes-empresa';
  readonly creditValue = 4.5;
  readonly type = 'cnpj';

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

    return parseOrSchemaError(HistoricoAlteracoesEmpresaSchema, result.value, 'apibrasil');
  }
}
