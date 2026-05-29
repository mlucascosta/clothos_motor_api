/**
 * @fileoverview Operation GarantiaSafra — DirectData Marketplace API.
 * Endpoint para realizar a consulta Garantia Safra. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/GarantiaSafra
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { GarantiaSafraRetornoSchema } from '../dtos/GarantiaSafraDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IGarantiaSafra } from '../ports/IGarantiaSafra.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: GarantiaSafraRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `GarantiaSafra`.
 *
 * @class GarantiaSafra
 * @implements {IGarantiaSafra}
 */
export class GarantiaSafra implements IGarantiaSafra {
  readonly path = '/api/GarantiaSafra';

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
