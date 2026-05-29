/**
 * @fileoverview Operation CertidaoNegativaDeLicitanteInidoneo — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CertidaoNegativaDeLicitanteInidoneo
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { CertidaoNegativaDeLicitanteInidoneoSchema } from '../dtos/CertidaoNegativaDeLicitanteInidoneoDto.js';
import type { ICertidaoNegativaDeLicitanteInidoneo } from '../ports/ICertidaoNegativaDeLicitanteInidoneo.js';

export class CertidaoNegativaDeLicitanteInidoneo implements ICertidaoNegativaDeLicitanteInidoneo {
  readonly path = '/certidao-negativa-de-licitante-inidoneo';
  readonly creditValue = 0.66;
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

    return parseOrSchemaError(CertidaoNegativaDeLicitanteInidoneoSchema, result.value, 'apibrasil');
  }
}
