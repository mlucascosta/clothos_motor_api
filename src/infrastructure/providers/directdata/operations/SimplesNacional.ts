/**
 * @fileoverview Operation SimplesNacional — DirectData Marketplace API.
 * Endpoint para realizar a consulta Simples Nacional.
 * @module infrastructure/providers/directdata/operations/SimplesNacional
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import { SimplesNacionalRetornoSchema } from '../dtos/SimplesNacionalDto.js';
import type { ISimplesNacional } from '../ports/ISimplesNacional.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: SimplesNacionalRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `SimplesNacional`.
 *
 * @class SimplesNacional
 * @implements {ISimplesNacional}
 */
export class SimplesNacional implements ISimplesNacional {
  readonly path = '/api/SimplesNacional';

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
