/**
 * @fileoverview Operation TribunalRegionalFederal — DirectData Marketplace API.
 * Endpoint para realizar a consulta TRF - Tribunal Regional Federal (Certidão Cível, Eleitoral ou Criminal).
 * @module infrastructure/providers/directdata/operations/TribunalRegionalFederal
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import { TribunalRegionalFederalRetornoSchema } from '../dtos/TribunalRegionalFederalDto.js';
import type { ITribunalRegionalFederal } from '../ports/ITribunalRegionalFederal.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: TribunalRegionalFederalRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `TribunalRegionalFederal`.
 *
 * @class TribunalRegionalFederal
 * @implements {ITribunalRegionalFederal}
 */
export class TribunalRegionalFederal implements ITribunalRegionalFederal {
  readonly path = '/api/TribunalRegionalFederal';

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
