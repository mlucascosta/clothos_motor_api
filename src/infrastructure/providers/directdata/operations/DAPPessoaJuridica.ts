/**
 * @fileoverview Operation DAPPessoaJuridica — DirectData Marketplace API.
 * Endpoint para realizar a consulta DAP - Declaração de Aptidão ao Pronaf - Pessoa Jurídica.
 * @module infrastructure/providers/directdata/operations/DAPPessoaJuridica
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { DAPPessoaJuridicaRetornoSchema } from '../dtos/DAPPessoaJuridicaDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { IDAPPessoaJuridica } from '../ports/IDAPPessoaJuridica.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: DAPPessoaJuridicaRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `DAPPessoaJuridica`.
 *
 * @class DAPPessoaJuridica
 * @implements {IDAPPessoaJuridica}
 */
export class DAPPessoaJuridica implements IDAPPessoaJuridica {
  readonly path = '/api/DAPPessoaJuridica';

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
