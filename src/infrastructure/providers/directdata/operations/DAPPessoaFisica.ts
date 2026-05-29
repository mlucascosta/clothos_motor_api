/**
 * @fileoverview Operation DAPPessoaFisica — DirectData Marketplace API.
 * Endpoint para realizar a consulta DAP - Declaração de Aptidão ao Pronaf - Pessoa Física.
 * @module infrastructure/providers/directdata/operations/DAPPessoaFisica
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { DAPPessoaFisicaRetornoSchema } from '../dtos/DAPPessoaFisicaDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IDAPPessoaFisica } from '../ports/IDAPPessoaFisica.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: DAPPessoaFisicaRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `DAPPessoaFisica`.
 *
 * @class DAPPessoaFisica
 * @implements {IDAPPessoaFisica}
 */
export class DAPPessoaFisica implements IDAPPessoaFisica {
  readonly path = '/api/DAPPessoaFisica';

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
