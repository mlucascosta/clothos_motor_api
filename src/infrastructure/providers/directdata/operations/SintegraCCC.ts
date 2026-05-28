/**
 * @fileoverview Operation SintegraCCC — DirectData Marketplace API.
 * Endpoint para realizar a consulta Sintegra - Cadastro Centralizado de Contribuinte - CCC.
 * @module infrastructure/providers/directdata/operations/SintegraCCC
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { SintegraCCCRetornoSchema } from '../dtos/SintegraCCCDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ISintegraCCC } from '../ports/ISintegraCCC.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: SintegraCCCRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `SintegraCCC`.
 *
 * @class SintegraCCC
 * @implements {ISintegraCCC}
 */
export class SintegraCCC implements ISintegraCCC {
  readonly path = '/api/SintegraCCC';

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
