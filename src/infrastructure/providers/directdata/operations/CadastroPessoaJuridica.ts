/**
 * @fileoverview Operation CadastroPessoaJuridica — DirectData Marketplace API.
 * Endpoint para realizar a consulta Cadastro - Pessoa Jurídica - Básica. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CadastroPessoaJuridica
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { CadastroPessoaJuridicaRetornoSchema } from '../dtos/CadastroPessoaJuridicaDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICadastroPessoaJuridica } from '../ports/ICadastroPessoaJuridica.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CadastroPessoaJuridicaRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CadastroPessoaJuridica`.
 *
 * @class CadastroPessoaJuridica
 * @implements {ICadastroPessoaJuridica}
 */
export class CadastroPessoaJuridica implements ICadastroPessoaJuridica {
  readonly path = '/api/CadastroPessoaJuridica';

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
