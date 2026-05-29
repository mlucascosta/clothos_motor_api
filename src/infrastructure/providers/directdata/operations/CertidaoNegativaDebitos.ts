/**
 * @fileoverview Operation CertidaoNegativaDebitos — DirectData Marketplace API.
 * Endpoint para realizar a consulta CND - Certidão Negativa de Débitos.
 * @module infrastructure/providers/directdata/operations/CertidaoNegativaDebitos
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CertidaoNegativaDebitosRetornoSchema } from '../dtos/CertidaoNegativaDebitosDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICertidaoNegativaDebitos } from '../ports/ICertidaoNegativaDebitos.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CertidaoNegativaDebitosRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CertidaoNegativaDebitos`.
 *
 * @class CertidaoNegativaDebitos
 * @implements {ICertidaoNegativaDebitos}
 */
export class CertidaoNegativaDebitos implements ICertidaoNegativaDebitos {
  readonly path = '/api/CertidaoNegativaDebitos';

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
