/**
 * @fileoverview Operation TCUCertidaoNegativaProcesso — DirectData Marketplace API.
 * Endpoint para realizar a consulta TCU - Certidão Negativa de Processo.
 * @module infrastructure/providers/directdata/operations/TCUCertidaoNegativaProcesso
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { TCUCertidaoNegativaProcessoRetornoSchema } from '../dtos/TCUCertidaoNegativaProcessoDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ITCUCertidaoNegativaProcesso } from '../ports/ITCUCertidaoNegativaProcesso.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: TCUCertidaoNegativaProcessoRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `TCUCertidaoNegativaProcesso`.
 *
 * @class TCUCertidaoNegativaProcesso
 * @implements {ITCUCertidaoNegativaProcesso}
 */
export class TCUCertidaoNegativaProcesso implements ITCUCertidaoNegativaProcesso {
  readonly path = '/api/TCUCertidaoNegativaProcesso';

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
