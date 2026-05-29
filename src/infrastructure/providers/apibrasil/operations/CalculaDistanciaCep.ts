/**
 * @fileoverview Operation CalculaDistanciaCep — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/CalculaDistanciaCep
 */

import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { CalculaDistanciaCepSchema } from '../dtos/CalculaDistanciaCepDto.js';
import type { ICalculaDistanciaCep } from '../ports/ICalculaDistanciaCep.js';

export class CalculaDistanciaCep implements ICalculaDistanciaCep {
  readonly path = '/calcula-distancia-cep';
  readonly creditValue = 0.03;
  readonly type = 'cep';

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

    return parseOrSchemaError(CalculaDistanciaCepSchema, result.value, 'apibrasil');
  }
}
