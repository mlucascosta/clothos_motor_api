import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type IniciarBuscaLoteResponse,
  IniciarBuscaLoteResponseSchema,
} from '../dtos/BuscaAssincronaDto.js';
import type {
  IIniciarBuscaProcessosLote,
  IniciarBuscaProcessosLoteInput,
} from '../ports/IIniciarBuscaProcessosLote.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export class IniciarBuscaProcessosLote implements IIniciarBuscaProcessosLote {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: IniciarBuscaProcessosLoteInput,
  ): Promise<Either<SourceError, IniciarBuscaLoteResponse>> {
    const body: Record<string, unknown> = {
      tipo: input.tipo,
      tribunais: input.tribunais,
    };
    if (input.nome !== undefined) body['nome'] = input.nome;
    if (input.numero_documento !== undefined) body['numero_documento'] = input.numero_documento;
    if (input.numero_oab !== undefined) body['numero_oab'] = input.numero_oab;
    if (input.estado_oab !== undefined) body['estado_oab'] = input.estado_oab;

    const result = await this.http.request<unknown>('/api/v1/tribunal/async/lote', {
      method: 'POST',
      body,
    });

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(IniciarBuscaLoteResponseSchema, result.value, 'escavador');
  }
}
