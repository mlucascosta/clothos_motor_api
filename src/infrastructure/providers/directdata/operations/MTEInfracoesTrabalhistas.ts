/**
 * @fileoverview Operation MTEInfracoesTrabalhistas — DirectData Marketplace API.
 * Endpoint para realizar a consulta Ministério do Trabalho e do Emprego (MTE) - Infrações Trabalhistas.
 * @module infrastructure/providers/directdata/operations/MTEInfracoesTrabalhistas
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { MTEInfracoesTrabalhistasRetornoSchema } from '../dtos/MTEInfracoesTrabalhistasDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IMTEInfracoesTrabalhistas } from '../ports/IMTEInfracoesTrabalhistas.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: MTEInfracoesTrabalhistasRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `MTEInfracoesTrabalhistas`.
 *
 * @class MTEInfracoesTrabalhistas
 * @implements {IMTEInfracoesTrabalhistas}
 */
export class MTEInfracoesTrabalhistas implements IMTEInfracoesTrabalhistas {
  readonly path = '/api/MTEInfracoesTrabalhistas';

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
