/**
 * @fileoverview Operation AuxilioReconstrucao — DirectData Marketplace API.
 * Endpoint para realizar a consulta Auxílio Reconstrução. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/AuxilioReconstrucao
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { AuxilioReconstrucaoRetornoSchema } from '../dtos/AuxilioReconstrucaoDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IAuxilioReconstrucao } from '../ports/IAuxilioReconstrucao.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: AuxilioReconstrucaoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `AuxilioReconstrucao`.
 *
 * @class AuxilioReconstrucao
 * @implements {IAuxilioReconstrucao}
 */
export class AuxilioReconstrucao implements IAuxilioReconstrucao {
  readonly path = '/api/AuxilioReconstrucao';

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
