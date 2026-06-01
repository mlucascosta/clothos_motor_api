/**
 * @fileoverview Operation RestituicaoIRPF — DirectData Marketplace API.
 * Endpoint para realizar a consulta Restituição Imposto de Renda - IRPF. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/RestituicaoIRPF
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import { RestituicaoIRPFRetornoSchema } from '../dtos/RestituicaoIRPFDto.js';
import type { IRestituicaoIRPF } from '../ports/IRestituicaoIRPF.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: RestituicaoIRPFRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `RestituicaoIRPF`.
 *
 * @class RestituicaoIRPF
 * @implements {IRestituicaoIRPF}
 */
export class RestituicaoIRPF implements IRestituicaoIRPF {
  readonly path = '/api/RestituicaoIRPF';

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
