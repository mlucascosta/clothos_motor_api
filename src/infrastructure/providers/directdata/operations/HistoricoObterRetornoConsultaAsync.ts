/**
 * @fileoverview Operation HistoricoObterRetornoConsultaAsync — DirectData Marketplace API.
 * Endpoint para obter o resultado de uma consulta assíncrona efetuada.
 * @module infrastructure/providers/directdata/operations/HistoricoObterRetornoConsultaAsync
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { HistoricoObterRetornoConsultaAsyncRetornoSchema } from '../dtos/HistoricoObterRetornoConsultaAsyncDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IHistoricoObterRetornoConsultaAsync } from '../ports/IHistoricoObterRetornoConsultaAsync.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: HistoricoObterRetornoConsultaAsyncRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `Historico/ObterRetornoConsultaAsync`.
 *
 * @class HistoricoObterRetornoConsultaAsync
 * @implements {IHistoricoObterRetornoConsultaAsync}
 */
export class HistoricoObterRetornoConsultaAsync implements IHistoricoObterRetornoConsultaAsync {
  readonly path = '/api/Historico/ObterRetornoConsultaAsync';

  constructor(private readonly http: IHttpClient) {}

  async execute(params: Record<string, string | undefined>): Promise<Either<SourceError, ReturnType<typeof ResponseSchema.parse>>> {
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    }

    const result = await this.http.request<unknown>(this.path, {
      method: 'GET',
      params: cleanParams,
    });

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(ResponseSchema, result.value, 'directdata');
  }
}
