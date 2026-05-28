import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type IniciarBuscaLoteResponse,
  IniciarBuscaLoteResponseSchema,
} from '../dtos/BuscaAssincronaDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export type IniciarBuscaLoteInput =
  | { tipo: 'busca_por_documento'; cpfCnpj: string; tribunais?: string[] }
  | { tipo: 'busca_por_nome'; nome: string; tribunais?: string[] };

export interface IIniciarBuscaLote {
  execute(input: IniciarBuscaLoteInput): Promise<Either<SourceError, IniciarBuscaLoteResponse>>;
}

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

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(IniciarBuscaLoteResponseSchema, result.value, 'escavador');
  }
}
