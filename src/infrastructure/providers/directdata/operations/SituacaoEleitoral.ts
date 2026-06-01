/**
 * @fileoverview Operation SituacaoEleitoral — DirectData Marketplace API.
 * Endpoint para realizar a consulta TSE - Situação Eleitoral. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/SituacaoEleitoral
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import { SituacaoEleitoralRetornoSchema } from '../dtos/SituacaoEleitoralDto.js';
import type { ISituacaoEleitoral } from '../ports/ISituacaoEleitoral.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: SituacaoEleitoralRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `SituacaoEleitoral`.
 *
 * @class SituacaoEleitoral
 * @implements {ISituacaoEleitoral}
 */
export class SituacaoEleitoral implements ISituacaoEleitoral {
  readonly path = '/api/SituacaoEleitoral';

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
