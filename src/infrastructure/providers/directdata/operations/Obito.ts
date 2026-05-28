/**
 * @fileoverview Operation Obito — DirectData Marketplace API.
 * Endpoint para realizar a consulta Óbito. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/Obito
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { ObitoRetornoSchema } from '../dtos/ObitoDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IObito } from '../ports/IObito.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: ObitoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `Obito`.
 *
 * @class Obito
 * @implements {IObito}
 */
export class Obito implements IObito {
  readonly path = '/api/Obito';

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
