/**
 * @fileoverview Operation CertidaoNegativaDebitosMunicipal — DirectData Marketplace API.
 * Endpoint para realizar a consulta CNDM - Certidão Negativa de Débitos Municipal.
 * @module infrastructure/providers/directdata/operations/CertidaoNegativaDebitosMunicipal
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CertidaoNegativaDebitosMunicipalRetornoSchema } from '../dtos/CertidaoNegativaDebitosMunicipalDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICertidaoNegativaDebitosMunicipal } from '../ports/ICertidaoNegativaDebitosMunicipal.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CertidaoNegativaDebitosMunicipalRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CertidaoNegativaDebitosMunicipal`.
 *
 * @class CertidaoNegativaDebitosMunicipal
 * @implements {ICertidaoNegativaDebitosMunicipal}
 */
export class CertidaoNegativaDebitosMunicipal implements ICertidaoNegativaDebitosMunicipal {
  readonly path = '/api/CertidaoNegativaDebitosMunicipal';

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
