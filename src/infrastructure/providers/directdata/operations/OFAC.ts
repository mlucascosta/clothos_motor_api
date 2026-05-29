/**
 * @fileoverview Operation OFAC — DirectData Marketplace API.
 * Endpoint para realizar a consulta OFAC - Sanctions List (SND and Non-SDN). Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/OFAC
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { OFACRetornoSchema } from '../dtos/OFACDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IOFAC } from '../ports/IOFAC.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: OFACRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `OFAC`.
 *
 * @class OFAC
 * @implements {IOFAC}
 */
export class OFAC implements IOFAC {
  readonly path = '/api/OFAC';

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
