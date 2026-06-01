/**
 * @fileoverview Operation MPMTMinisterioPublicoMatoGrosso — DirectData Marketplace API.
 * Endpoint para realizar a consulta Ministério Público do Estado de Mato Grosso (MPMT) - Procedimentos Investigatórios Extrajudiciais.
 * @module infrastructure/providers/directdata/operations/MPMTMinisterioPublicoMatoGrosso
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import { MPMTMinisterioPublicoMatoGrossoRetornoSchema } from '../dtos/MPMTMinisterioPublicoMatoGrossoDto.js';
import type { IMPMTMinisterioPublicoMatoGrosso } from '../ports/IMPMTMinisterioPublicoMatoGrosso.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: MPMTMinisterioPublicoMatoGrossoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `MPMTMinisterioPublicoMatoGrosso`.
 *
 * @class MPMTMinisterioPublicoMatoGrosso
 * @implements {IMPMTMinisterioPublicoMatoGrosso}
 */
export class MPMTMinisterioPublicoMatoGrosso implements IMPMTMinisterioPublicoMatoGrosso {
  readonly path = '/api/MPMTMinisterioPublicoMatoGrosso';

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
