/**
 * @fileoverview Operation HistoricoVeiculos — DirectData Marketplace API.
 * Endpoint para realizar a consulta Histórico Veicular PF e PJ - São Paulo. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/HistoricoVeiculos
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { HistoricoVeiculosRetornoSchema } from '../dtos/HistoricoVeiculosDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IHistoricoVeiculos } from '../ports/IHistoricoVeiculos.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: HistoricoVeiculosRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `HistoricoVeiculos`.
 *
 * @class HistoricoVeiculos
 * @implements {IHistoricoVeiculos}
 */
export class HistoricoVeiculos implements IHistoricoVeiculos {
  readonly path = '/api/HistoricoVeiculos';

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

    if (isLeft(result)) return result;

    return parseOrSchemaError(ResponseSchema, result.value, 'directdata');
  }
}
