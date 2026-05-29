/**
 * @fileoverview Operation FinCEN — DirectData Marketplace API.
 * Endpoint para realizar a consulta FINCEN - Financial Crimes Enforcement Network.
 * @module infrastructure/providers/directdata/operations/FinCEN
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { FinCENRetornoSchema } from '../dtos/FinCENDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IFinCEN } from '../ports/IFinCEN.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: FinCENRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `FinCEN`.
 *
 * @class FinCEN
 * @implements {IFinCEN}
 */
export class FinCEN implements IFinCEN {
  readonly path = '/api/FinCEN';

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
