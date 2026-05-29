/**
 * @fileoverview Operation CadastroNacionalImprobidadeAdministrativa — DirectData Marketplace API.
 * Endpoint para realizar a consulta CNIA - Cadastro Nacional de Condenações Cíveis por Ato de Improbidade Administrativa e Inelegibilidade.
 * @module infrastructure/providers/directdata/operations/CadastroNacionalImprobidadeAdministrativa
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CadastroNacionalImprobidadeAdministrativaRetornoSchema } from '../dtos/CadastroNacionalImprobidadeAdministrativaDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICadastroNacionalImprobidadeAdministrativa } from '../ports/ICadastroNacionalImprobidadeAdministrativa.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CadastroNacionalImprobidadeAdministrativaRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CadastroNacionalImprobidadeAdministrativa`.
 *
 * @class CadastroNacionalImprobidadeAdministrativa
 * @implements {ICadastroNacionalImprobidadeAdministrativa}
 */
export class CadastroNacionalImprobidadeAdministrativa implements ICadastroNacionalImprobidadeAdministrativa {
  readonly path = '/api/CadastroNacionalImprobidadeAdministrativa';

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
