/**
 * @fileoverview Operation ProcessosJudiciaisSimplificada — DirectData Marketplace API.
 * Endpoint para realizar a consulta Processos Judiciais - Simplificada (Base). Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/ProcessosJudiciaisSimplificada
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { ProcessosJudiciaisSimplificadaRetornoSchema } from '../dtos/ProcessosJudiciaisSimplificadaDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IProcessosJudiciaisSimplificada } from '../ports/IProcessosJudiciaisSimplificada.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: ProcessosJudiciaisSimplificadaRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `ProcessosJudiciaisSimplificada`.
 *
 * @class ProcessosJudiciaisSimplificada
 * @implements {IProcessosJudiciaisSimplificada}
 */
export class ProcessosJudiciaisSimplificada implements IProcessosJudiciaisSimplificada {
  readonly path = '/api/ProcessosJudiciaisSimplificada';

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
