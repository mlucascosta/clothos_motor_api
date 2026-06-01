/**
 * @fileoverview Operation CertidaoConjuntaDeDebitosPessoaJuridica — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CertidaoConjuntaDeDebitosPessoaJuridica
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { CertidaoConjuntaDeDebitosPessoaJuridicaSchema } from '../dtos/CertidaoConjuntaDeDebitosPessoaJuridicaDto.js';
import type { CertidaoConjuntaDeDebitosPessoaJuridicaDto } from '../dtos/CertidaoConjuntaDeDebitosPessoaJuridicaDto.js';
import type { ICertidaoConjuntaDeDebitosPessoaJuridica } from '../ports/ICertidaoConjuntaDeDebitosPessoaJuridica.js';

export class CertidaoConjuntaDeDebitosPessoaJuridica
  implements ICertidaoConjuntaDeDebitosPessoaJuridica
{
  readonly path = '/certidao-conjunta-de-debitos-pj';
  readonly creditValue = 0.72;
  readonly type = 'cnpj';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CertidaoConjuntaDeDebitosPessoaJuridicaDto>> {
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    }

    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      body: cleanParams,
    });

    if (isLeft(result)) return result;

    return parseOrSchemaError(
      CertidaoConjuntaDeDebitosPessoaJuridicaSchema,
      result.value,
      'apibrasil',
    );
  }
}
