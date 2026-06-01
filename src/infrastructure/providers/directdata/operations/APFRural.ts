/**
 * @fileoverview Operation APFRural — DirectData Marketplace API.
 * Endpoint para realizar a consulta APF Rural - Autorização Provisória de Funcionamento Rural.
 * @module infrastructure/providers/directdata/operations/APFRural
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { APFRuralRetornoSchema } from '../dtos/APFRuralDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IAPFRural } from '../ports/IAPFRural.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: APFRuralRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `APFRural`.
 *
 * @class APFRural
 * @implements {IAPFRural}
 */
export class APFRural implements IAPFRural {
  readonly path = '/api/APFRural';

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
