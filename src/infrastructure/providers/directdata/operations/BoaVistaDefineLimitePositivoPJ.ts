/**
 * @fileoverview Operation BoaVistaDefineLimitePositivoPJ — DirectData Marketplace API.
 * Endpoint para realizar a consulta Boa Vista - Define Limite Positivo Pessoa Jurídica.
 * @module infrastructure/providers/directdata/operations/BoaVistaDefineLimitePositivoPJ
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { BoaVistaDefineLimitePositivoPJRetornoSchema } from '../dtos/BoaVistaDefineLimitePositivoPJDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IBoaVistaDefineLimitePositivoPJ } from '../ports/IBoaVistaDefineLimitePositivoPJ.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: BoaVistaDefineLimitePositivoPJRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `BoaVistaDefineLimitePositivoPJ`.
 *
 * @class BoaVistaDefineLimitePositivoPJ
 * @implements {IBoaVistaDefineLimitePositivoPJ}
 */
export class BoaVistaDefineLimitePositivoPJ implements IBoaVistaDefineLimitePositivoPJ {
  readonly path = '/api/BoaVistaDefineLimitePositivoPJ';

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
