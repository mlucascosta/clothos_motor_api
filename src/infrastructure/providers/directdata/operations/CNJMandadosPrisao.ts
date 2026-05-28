/**
 * @fileoverview Operation CNJMandadosPrisao — DirectData Marketplace API.
 * Endpoint para realizar a consulta CNJ - Mandados de Prisão.
 * @module infrastructure/providers/directdata/operations/CNJMandadosPrisao
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { CNJMandadosPrisaoRetornoSchema } from '../dtos/CNJMandadosPrisaoDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICNJMandadosPrisao } from '../ports/ICNJMandadosPrisao.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CNJMandadosPrisaoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CNJMandadosPrisao`.
 *
 * @class CNJMandadosPrisao
 * @implements {ICNJMandadosPrisao}
 */
export class CNJMandadosPrisao implements ICNJMandadosPrisao {
  readonly path = '/api/CNJMandadosPrisao';

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

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(ResponseSchema, result.value, 'directdata');
  }
}
