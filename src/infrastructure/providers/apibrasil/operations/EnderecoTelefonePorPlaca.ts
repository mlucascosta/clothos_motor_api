/**
 * @fileoverview Operation EnderecoTelefonePorPlaca — APIBrasil API.
 * @module infrastructure/providers/apibrasil/operations/EnderecoTelefonePorPlaca
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { EnderecoTelefonePorPlacaSchema } from '../dtos/EnderecoTelefonePorPlacaDto.js';
import type { IEnderecoTelefonePorPlaca } from '../ports/IEnderecoTelefonePorPlaca.js';

export class EnderecoTelefonePorPlaca implements IEnderecoTelefonePorPlaca {
  readonly path = '/endereco-telefone-placa';
  readonly creditValue = 3.89;
  readonly type = 'vehicles';

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

    return parseOrSchemaError(EnderecoTelefonePorPlacaSchema, result.value, 'apibrasil');
  }
}
