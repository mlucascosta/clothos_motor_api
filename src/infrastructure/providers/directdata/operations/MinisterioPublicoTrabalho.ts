/**
 * @fileoverview Operation MinisterioPublicoTrabalho — DirectData Marketplace API.
 * Endpoint para realizar a consulta MPT - Ministério Público do Trabalho .
 * @module infrastructure/providers/directdata/operations/MinisterioPublicoTrabalho
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import { MinisterioPublicoTrabalhoRetornoSchema } from '../dtos/MinisterioPublicoTrabalhoDto.js';
import type { IMinisterioPublicoTrabalho } from '../ports/IMinisterioPublicoTrabalho.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: MinisterioPublicoTrabalhoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `MinisterioPublicoTrabalho`.
 *
 * @class MinisterioPublicoTrabalho
 * @implements {IMinisterioPublicoTrabalho}
 */
export class MinisterioPublicoTrabalho implements IMinisterioPublicoTrabalho {
  readonly path = '/api/MinisterioPublicoTrabalho';

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
