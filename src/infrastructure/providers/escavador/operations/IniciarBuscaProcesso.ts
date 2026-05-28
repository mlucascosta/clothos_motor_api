import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type IniciarBuscaResponse,
  IniciarBuscaResponseSchema,
} from '../dtos/BuscaAssincronaDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export interface IniciarBuscaProcessoInput {
  numero_cnj: string;
}

export interface IIniciarBuscaProcesso {
  execute(input: IniciarBuscaProcessoInput): Promise<Either<SourceError, IniciarBuscaResponse>>;
}

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
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(IniciarBuscaResponseSchema, result.value, 'escavador');
  }
}
