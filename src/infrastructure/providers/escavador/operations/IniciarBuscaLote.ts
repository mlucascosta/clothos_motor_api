import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type IniciarBuscaLoteResponse,
  IniciarBuscaLoteResponseSchema,
} from '../dtos/BuscaAssincronaDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IIniciarBuscaLote, IniciarBuscaLoteInput } from '../ports/IIniciarBuscaLote.js';

export class IniciarBuscaLote implements IIniciarBuscaLote {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: IniciarBuscaLoteInput): Promise<Either<SourceError, IniciarBuscaLoteResponse>> {
    const body: Record<string, unknown> = { tipo: input.tipo };
    if (input.tipo === 'busca_por_documento') {
      body['numero_documento'] = input.cpfCnpj;
    } else {
      body['nome'] = input.nome;
    }
    if (input.tribunais !== undefined) body['tribunais'] = input.tribunais;

    const result = await this.http.request<unknown>('/api/v1/tribunal/async/lote', {
      method: 'POST',
      body,
    });

    if (isLeft(result)) return result;

    return parseOrSchemaError(IniciarBuscaLoteResponseSchema, result.value, 'escavador');
  }
}
