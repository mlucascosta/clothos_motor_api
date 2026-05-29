/**
 * @fileoverview Operation RenapoMexico — DirectData Marketplace API.
 * Endpoint para realizar a consulta Registro Nacional de Población - CURP - México.
 * @module infrastructure/providers/directdata/operations/RenapoMexico
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { RenapoMexicoRetornoSchema } from '../dtos/RenapoMexicoDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IRenapoMexico } from '../ports/IRenapoMexico.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: RenapoMexicoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `RenapoMexico`.
 *
 * @class RenapoMexico
 * @implements {IRenapoMexico}
 */
export class RenapoMexico implements IRenapoMexico {
  readonly path = '/api/RenapoMexico';

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
