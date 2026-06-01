/**
 * @fileoverview Operation CAFCadastroNacionalAgriculturaPF — DirectData Marketplace API.
 * Endpoint para realizar a consulta CAF - Cadastro Nacional de Agricultura Familiar - PF.
 * @module infrastructure/providers/directdata/operations/CAFCadastroNacionalAgriculturaPF
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { CAFCadastroNacionalAgriculturaPFRetornoSchema } from '../dtos/CAFCadastroNacionalAgriculturaPFDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICAFCadastroNacionalAgriculturaPF } from '../ports/ICAFCadastroNacionalAgriculturaPF.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CAFCadastroNacionalAgriculturaPFRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CAFCadastroNacionalAgriculturaPF`.
 *
 * @class CAFCadastroNacionalAgriculturaPF
 * @implements {ICAFCadastroNacionalAgriculturaPF}
 */
export class CAFCadastroNacionalAgriculturaPF implements ICAFCadastroNacionalAgriculturaPF {
  readonly path = '/api/CAFCadastroNacionalAgriculturaPF';

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
