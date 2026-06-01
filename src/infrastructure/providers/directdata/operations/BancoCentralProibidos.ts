/**
 * @fileoverview Operation BancoCentralProibidos — DirectData Marketplace API.
 * Endpoint para realizar a consulta Banco Central - Quadro Geral de Proibidos. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/BancoCentralProibidos
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { BancoCentralProibidosRetornoSchema } from '../dtos/BancoCentralProibidosDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IBancoCentralProibidos } from '../ports/IBancoCentralProibidos.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: BancoCentralProibidosRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `BancoCentralProibidos`.
 *
 * @class BancoCentralProibidos
 * @implements {IBancoCentralProibidos}
 */
export class BancoCentralProibidos implements IBancoCentralProibidos {
  readonly path = '/api/BancoCentralProibidos';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ReturnType<typeof ResponseSchema.parse>>> {
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
