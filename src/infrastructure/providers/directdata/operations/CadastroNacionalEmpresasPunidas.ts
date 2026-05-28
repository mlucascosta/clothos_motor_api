/**
 * @fileoverview Operation CadastroNacionalEmpresasPunidas — DirectData Marketplace API.
 * Endpoint para realizar a consulta CNEP - Cadastro Nacional de Empresas Punidas. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CadastroNacionalEmpresasPunidas
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { CadastroNacionalEmpresasPunidasRetornoSchema } from '../dtos/CadastroNacionalEmpresasPunidasDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICadastroNacionalEmpresasPunidas } from '../ports/ICadastroNacionalEmpresasPunidas.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CadastroNacionalEmpresasPunidasRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CadastroNacionalEmpresasPunidas`.
 *
 * @class CadastroNacionalEmpresasPunidas
 * @implements {ICadastroNacionalEmpresasPunidas}
 */
export class CadastroNacionalEmpresasPunidas implements ICadastroNacionalEmpresasPunidas {
  readonly path = '/api/CadastroNacionalEmpresasPunidas';

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
