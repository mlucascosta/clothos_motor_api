/**
 * @fileoverview Operation ProcessosJudiciaisAgrupada — DirectData Marketplace API.
 * Endpoint para realizar a consulta Processos Judiciais - Agrupada (Base). Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/ProcessosJudiciaisAgrupada
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { ProcessosJudiciaisAgrupadaRetornoSchema } from '../dtos/ProcessosJudiciaisAgrupadaDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IProcessosJudiciaisAgrupada } from '../ports/IProcessosJudiciaisAgrupada.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: ProcessosJudiciaisAgrupadaRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `ProcessosJudiciaisAgrupada`.
 *
 * @class ProcessosJudiciaisAgrupada
 * @implements {IProcessosJudiciaisAgrupada}
 */
export class ProcessosJudiciaisAgrupada implements IProcessosJudiciaisAgrupada {
  readonly path = '/api/ProcessosJudiciaisAgrupada';

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

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(ResponseSchema, result.value, 'directdata');
  }
}
