/**
 * @fileoverview Operation AcordosLeniencia — DirectData Marketplace API.
 * Endpoint para realizar a consulta Acordos de Leniência. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/AcordosLeniencia
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { AcordosLenienciaRetornoSchema } from '../dtos/AcordosLenienciaDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IAcordosLeniencia } from '../ports/IAcordosLeniencia.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: AcordosLenienciaRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `AcordosLeniencia`.
 *
 * @class AcordosLeniencia
 * @implements {IAcordosLeniencia}
 */
export class AcordosLeniencia implements IAcordosLeniencia {
  readonly path = '/api/AcordosLeniencia';

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
