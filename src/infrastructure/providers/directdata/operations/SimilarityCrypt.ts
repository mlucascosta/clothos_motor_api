/**
 * @fileoverview Operation SimilarityCrypt — DirectData Marketplace API.
 * Endpoint para realizar a consulta de Similarity Crypt. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/SimilarityCrypt
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { SimilarityCryptRetornoSchema } from '../dtos/SimilarityCryptDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ISimilarityCrypt } from '../ports/ISimilarityCrypt.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: SimilarityCryptRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `Similarity/Crypt`.
 *
 * @class SimilarityCrypt
 * @implements {ISimilarityCrypt}
 */
export class SimilarityCrypt implements ISimilarityCrypt {
  readonly path = '/api/Similarity/Crypt';

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
