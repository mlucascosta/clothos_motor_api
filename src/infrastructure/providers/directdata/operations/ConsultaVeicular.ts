/**
 * @fileoverview Operation ConsultaVeicular — DirectData Marketplace API.
 * Endpoint para realizar a consulta Consulta Veicular . Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/ConsultaVeicular
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { ConsultaVeicularRetornoSchema } from '../dtos/ConsultaVeicularDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IConsultaVeicular } from '../ports/IConsultaVeicular.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: ConsultaVeicularRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `ConsultaVeicular`.
 *
 * @class ConsultaVeicular
 * @implements {IConsultaVeicular}
 */
export class ConsultaVeicular implements IConsultaVeicular {
  readonly path = '/api/ConsultaVeicular';

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
