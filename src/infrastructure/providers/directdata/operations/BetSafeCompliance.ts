/**
 * @fileoverview Operation BetSafeCompliance — DirectData Marketplace API.
 * Endpoint para realizar a consulta Bet Safe Compliance . Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/BetSafeCompliance
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { BetSafeComplianceRetornoSchema } from '../dtos/BetSafeComplianceDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IBetSafeCompliance } from '../ports/IBetSafeCompliance.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: BetSafeComplianceRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `BetSafeCompliance`.
 *
 * @class BetSafeCompliance
 * @implements {IBetSafeCompliance}
 */
export class BetSafeCompliance implements IBetSafeCompliance {
  readonly path = '/api/BetSafeCompliance';

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
