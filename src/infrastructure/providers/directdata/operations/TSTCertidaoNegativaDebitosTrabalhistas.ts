/**
 * @fileoverview Operation TSTCertidaoNegativaDebitosTrabalhistas — DirectData Marketplace API.
 * Endpoint para realizar a consulta TST - Certidão Negativa de Débitos Trabalhistas.
 * @module infrastructure/providers/directdata/operations/TSTCertidaoNegativaDebitosTrabalhistas
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import { TSTCertidaoNegativaDebitosTrabalhistasRetornoSchema } from '../dtos/TSTCertidaoNegativaDebitosTrabalhistasDto.js';
import type { ITSTCertidaoNegativaDebitosTrabalhistas } from '../ports/ITSTCertidaoNegativaDebitosTrabalhistas.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: TSTCertidaoNegativaDebitosTrabalhistasRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `TSTCertidaoNegativaDebitosTrabalhistas`.
 *
 * @class TSTCertidaoNegativaDebitosTrabalhistas
 * @implements {ITSTCertidaoNegativaDebitosTrabalhistas}
 */
export class TSTCertidaoNegativaDebitosTrabalhistas
  implements ITSTCertidaoNegativaDebitosTrabalhistas
{
  readonly path = '/api/TSTCertidaoNegativaDebitosTrabalhistas';

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
