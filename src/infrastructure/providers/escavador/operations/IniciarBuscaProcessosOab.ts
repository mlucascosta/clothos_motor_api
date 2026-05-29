import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type IniciarBuscaLoteResponse,
  IniciarBuscaLoteResponseSchema,
} from '../dtos/BuscaAssincronaDto.js';
import type {
  IIniciarBuscaProcessosOab,
  IniciarBuscaProcessosOabInput,
} from '../ports/IIniciarBuscaProcessosOab.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';

export class IniciarBuscaProcessosOab implements IIniciarBuscaProcessosOab {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: IniciarBuscaProcessosOabInput,
  ): Promise<Either<SourceError, IniciarBuscaLoteResponse>> {
    const body: Record<string, unknown> = {
      tipo: 'busca_por_oab',
      numero_oab: input.numero_oab,
      estado_oab: input.estado_oab,
    };
    if (input.tribunais !== undefined) body['tribunais'] = input.tribunais;

    const result = await this.http.request<unknown>('/api/v1/tribunal/async/lote', {
      method: 'POST',
      body,
    });

    if (isLeft(result)) return result;

    return parseOrSchemaError(IniciarBuscaLoteResponseSchema, result.value, 'escavador');
  }
}
