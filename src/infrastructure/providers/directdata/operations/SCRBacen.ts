/**
 * @fileoverview Operation SCRBacen — DirectData Marketplace API.
 * Endpoint para realizar a consulta SCR Analítico - Resumo BACEN. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/SCRBacen
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { SCRBacenRetornoSchema } from '../dtos/SCRBacenDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ISCRBacen } from '../ports/ISCRBacen.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: SCRBacenRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `SCRBacen`.
 *
 * @class SCRBacen
 * @implements {ISCRBacen}
 */
export class SCRBacen implements ISCRBacen {
  readonly path = '/api/SCRBacen';

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
