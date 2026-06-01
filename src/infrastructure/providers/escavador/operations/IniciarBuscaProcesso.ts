import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type IniciarBuscaResponse,
  IniciarBuscaResponseSchema,
} from '../dtos/BuscaAssincronaDto.js';
import type {
  IIniciarBuscaProcesso,
  IniciarBuscaProcessoInput,
} from '../ports/IIniciarBuscaProcesso.js';

export class IniciarBuscaProcesso implements IIniciarBuscaProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: IniciarBuscaProcessoInput,
  ): Promise<Either<SourceError, IniciarBuscaResponse>> {
    const encodedNumero = encodeURIComponent(input.numero_cnj);
    const result = await this.http.request<unknown>(
      `/api/v1/processo-tribunal/${encodedNumero}/async`,
      { method: 'POST', body: {} },
    );
    if (isLeft(result)) return result;
    return parseOrSchemaError(IniciarBuscaResponseSchema, result.value, 'escavador');
  }
}
