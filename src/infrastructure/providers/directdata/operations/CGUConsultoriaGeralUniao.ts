/**
 * @fileoverview Operation CGUConsultoriaGeralUniao — DirectData Marketplace API.
 * Endpoint para realizar a consulta Consultoria Geral da União - CGU.
 * @module infrastructure/providers/directdata/operations/CGUConsultoriaGeralUniao
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CGUConsultoriaGeralUniaoRetornoSchema } from '../dtos/CGUConsultoriaGeralUniaoDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICGUConsultoriaGeralUniao } from '../ports/ICGUConsultoriaGeralUniao.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CGUConsultoriaGeralUniaoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CGUConsultoriaGeralUniao`.
 *
 * @class CGUConsultoriaGeralUniao
 * @implements {ICGUConsultoriaGeralUniao}
 */
export class CGUConsultoriaGeralUniao implements ICGUConsultoriaGeralUniao {
  readonly path = '/api/CGUConsultoriaGeralUniao';

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
