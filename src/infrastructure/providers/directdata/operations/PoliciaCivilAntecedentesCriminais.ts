/**
 * @fileoverview Operation PoliciaCivilAntecedentesCriminais — DirectData Marketplace API.
 * Endpoint para realizar a consulta Polícia Civil - Antecedentes Criminais.
 * @module infrastructure/providers/directdata/operations/PoliciaCivilAntecedentesCriminais
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { PoliciaCivilAntecedentesCriminaisRetornoSchema } from '../dtos/PoliciaCivilAntecedentesCriminaisDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IPoliciaCivilAntecedentesCriminais } from '../ports/IPoliciaCivilAntecedentesCriminais.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: PoliciaCivilAntecedentesCriminaisRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `PoliciaCivilAntecedentesCriminais`.
 *
 * @class PoliciaCivilAntecedentesCriminais
 * @implements {IPoliciaCivilAntecedentesCriminais}
 */
export class PoliciaCivilAntecedentesCriminais implements IPoliciaCivilAntecedentesCriminais {
  readonly path = '/api/PoliciaCivilAntecedentesCriminais';

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
