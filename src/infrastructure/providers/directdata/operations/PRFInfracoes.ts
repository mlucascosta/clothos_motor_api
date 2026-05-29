/**
 * @fileoverview Operation PRFInfracoes — DirectData Marketplace API.
 * Endpoint para realizar a consulta Polícia Rodoviária Federal - Infrações. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/PRFInfracoes
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { PRFInfracoesRetornoSchema } from '../dtos/PRFInfracoesDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IPRFInfracoes } from '../ports/IPRFInfracoes.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: PRFInfracoesRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `PRFInfracoes`.
 *
 * @class PRFInfracoes
 * @implements {IPRFInfracoes}
 */
export class PRFInfracoes implements IPRFInfracoes {
  readonly path = '/api/PRFInfracoes';

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
