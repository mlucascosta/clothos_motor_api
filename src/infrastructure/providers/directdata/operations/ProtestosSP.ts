/**
 * @fileoverview Operation ProtestosSP — DirectData Marketplace API.
 * Endpoint para realizar a consulta Protestos - SP.
 * @module infrastructure/providers/directdata/operations/ProtestosSP
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { ProtestosSPRetornoSchema } from '../dtos/ProtestosSPDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IProtestosSP } from '../ports/IProtestosSP.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: ProtestosSPRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `ProtestosSP`.
 *
 * @class ProtestosSP
 * @implements {IProtestosSP}
 */
export class ProtestosSP implements IProtestosSP {
  readonly path = '/api/ProtestosSP';

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
