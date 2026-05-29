/**
 * @fileoverview Operation CertidaoConjuntaDeDebitosPessoaFisica — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CertidaoConjuntaDeDebitosPessoaFisica
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { CertidaoConjuntaDeDebitosPessoaFisicaSchema } from '../dtos/CertidaoConjuntaDeDebitosPessoaFisicaDto.js';
import type { ICertidaoConjuntaDeDebitosPessoaFisica } from '../ports/ICertidaoConjuntaDeDebitosPessoaFisica.js';

export class CertidaoConjuntaDeDebitosPessoaFisica implements ICertidaoConjuntaDeDebitosPessoaFisica {
  readonly path = '/certidao-conjunta-de-debitos-pf';
  readonly creditValue = 0.72;
  readonly type = 'cpf';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, unknown>> {
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

    return parseOrSchemaError(CertidaoConjuntaDeDebitosPessoaFisicaSchema, result.value, 'apibrasil');
  }
}
