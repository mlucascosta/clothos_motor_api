/**
 * @fileoverview Operation TribunalRegionalTrabalho — DirectData Marketplace API.
 * Endpoint para realizar a consulta TRT - Tribunal Regional do Trabalho.
 * @module infrastructure/providers/directdata/operations/TribunalRegionalTrabalho
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { TribunalRegionalTrabalhoRetornoSchema } from '../dtos/TribunalRegionalTrabalhoDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ITribunalRegionalTrabalho } from '../ports/ITribunalRegionalTrabalho.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: TribunalRegionalTrabalhoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `TribunalRegionalTrabalho`.
 *
 * @class TribunalRegionalTrabalho
 * @implements {ITribunalRegionalTrabalho}
 */
export class TribunalRegionalTrabalho implements ITribunalRegionalTrabalho {
  readonly path = '/api/TribunalRegionalTrabalho';

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
