/**
 * @fileoverview Operation SCRBacenDetalhada — DirectData Marketplace API.
 * Endpoint para realizar a consulta SCR Detalhada - Resumo BACEN.
 * @module infrastructure/providers/directdata/operations/SCRBacenDetalhada
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { SCRBacenDetalhadaRetornoSchema } from '../dtos/SCRBacenDetalhadaDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ISCRBacenDetalhada } from '../ports/ISCRBacenDetalhada.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: SCRBacenDetalhadaRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `SCRBacenDetalhada`.
 *
 * @class SCRBacenDetalhada
 * @implements {ISCRBacenDetalhada}
 */
export class SCRBacenDetalhada implements ISCRBacenDetalhada {
  readonly path = '/api/SCRBacenDetalhada';

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
