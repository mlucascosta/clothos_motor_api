/**
 * @fileoverview Operation DossieCreditoCompleto — DirectData Marketplace API.
 * Endpoint para realizar a consulta Dossiê QUOD - Completo. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/DossieCreditoCompleto
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { DossieCreditoCompletoRetornoSchema } from '../dtos/DossieCreditoCompletoDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IDossieCreditoCompleto } from '../ports/IDossieCreditoCompleto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: DossieCreditoCompletoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `DossieCreditoCompleto`.
 *
 * @class DossieCreditoCompleto
 * @implements {IDossieCreditoCompleto}
 */
export class DossieCreditoCompleto implements IDossieCreditoCompleto {
  readonly path = '/api/DossieCreditoCompleto';

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
