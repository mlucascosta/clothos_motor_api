/**
 * @fileoverview Operation Historico — DirectData Marketplace API.
 * Endpoint para recuperar o retorno de uma consulta efetuada.
 * @module infrastructure/providers/directdata/operations/Historico
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { HistoricoRetornoSchema } from '../dtos/HistoricoDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IHistorico } from '../ports/IHistorico.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: HistoricoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `Historico`.
 *
 * @class Historico
 * @implements {IHistorico}
 */
export class Historico implements IHistorico {
  readonly path = '/api/Historico';

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
