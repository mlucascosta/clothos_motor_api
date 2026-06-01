/**
 * @fileoverview Operation CertidaoConjuntaDebitosPessoaJuridica — DirectData Marketplace API.
 * Endpoint para realizar a consulta CCD - Certidão Conjunta de Débitos - Pessoa Jurídica.
 * @module infrastructure/providers/directdata/operations/CertidaoConjuntaDebitosPessoaJuridica
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import { CertidaoConjuntaDebitosPessoaJuridicaRetornoSchema } from '../dtos/CertidaoConjuntaDebitosPessoaJuridicaDto.js';
import { DirectDataMetaDadosSchema } from '../dtos/DirectDataResponseDto.js';
import type { ICertidaoConjuntaDebitosPessoaJuridica } from '../ports/ICertidaoConjuntaDebitosPessoaJuridica.js';

const ResponseSchema = z.object({
  metaDados: DirectDataMetaDadosSchema,
  retorno: CertidaoConjuntaDebitosPessoaJuridicaRetornoSchema.nullable(),
});

/**
 * Operation para endpoint `CertidaoConjuntaDebitosPessoaJuridica`.
 *
 * @class CertidaoConjuntaDebitosPessoaJuridica
 * @implements {ICertidaoConjuntaDebitosPessoaJuridica}
 */
export class CertidaoConjuntaDebitosPessoaJuridica
  implements ICertidaoConjuntaDebitosPessoaJuridica
{
  readonly path = '/api/CertidaoConjuntaDebitosPessoaJuridica';

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
