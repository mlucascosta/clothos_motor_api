/**
 * @fileoverview Operation CaixaRegularidadeEmpregadorFGTS — DirectData Marketplace API.
 * Endpoint para realizar a consulta FGTS - Regularidade do Empregador .
 * @module infrastructure/providers/directdata/operations/CaixaRegularidadeEmpregadorFGTS
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { CaixaRegularidadeEmpregadorFGTSRetornoSchema } from '../dtos/CaixaRegularidadeEmpregadorFGTSDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICaixaRegularidadeEmpregadorFGTS } from '../ports/ICaixaRegularidadeEmpregadorFGTS.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CaixaRegularidadeEmpregadorFGTSRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CaixaRegularidadeEmpregadorFGTS`.
 *
 * @class CaixaRegularidadeEmpregadorFGTS
 * @implements {ICaixaRegularidadeEmpregadorFGTS}
 */
export class CaixaRegularidadeEmpregadorFGTS implements ICaixaRegularidadeEmpregadorFGTS {
  readonly path = '/api/CaixaRegularidadeEmpregadorFGTS';

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
