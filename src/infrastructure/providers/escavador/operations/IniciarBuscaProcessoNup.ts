import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type IniciarBuscaResponse,
  IniciarBuscaResponseSchema,
} from '../dtos/BuscaAssincronaDto.js';
import type {
  IIniciarBuscaProcessoNup,
  IniciarBuscaProcessoNupInput,
} from '../ports/IIniciarBuscaProcessoNup.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export class IniciarBuscaProcessoNup implements IIniciarBuscaProcessoNup {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: IniciarBuscaProcessoNupInput,
  ): Promise<Either<SourceError, IniciarBuscaResponse>> {
    const encodedNup = encodeURIComponent(input.nup);
    const result = await this.http.request<unknown>(
      `/api/v1/processo-administrativo/${encodedNup}/async`,
      { method: 'POST', body: {} },
    );

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(IniciarBuscaResponseSchema, result.value, 'escavador');
  }
}
