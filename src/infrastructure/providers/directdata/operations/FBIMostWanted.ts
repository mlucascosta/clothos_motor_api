/**
 * @fileoverview Operation FBIMostWanted — DirectData Marketplace API.
 * Endpoint para realizar a consulta FBI - Most Wanted. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/FBIMostWanted
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import { FBIMostWantedRetornoSchema } from '../dtos/FBIMostWantedDto.js';
import type { IFBIMostWanted } from '../ports/IFBIMostWanted.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: FBIMostWantedRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `FBIMostWanted`.
 *
 * @class FBIMostWanted
 * @implements {IFBIMostWanted}
 */
export class FBIMostWanted implements IFBIMostWanted {
  readonly path = '/api/FBIMostWanted';

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
