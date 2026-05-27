import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import { IniciarBuscaResponseSchema, type IniciarBuscaResponse } from '../dtos/BuscaAssincronaDto.js';

export interface IniciarBuscaProcessoInput {
  numero_cnj: string;
  tribunais?: string[];
}

export interface IIniciarBuscaProcesso {
  execute(input: IniciarBuscaProcessoInput): Promise<Either<SourceError, IniciarBuscaResponse>>;
}

export class IniciarBuscaProcesso implements IIniciarBuscaProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: IniciarBuscaProcessoInput): Promise<Either<SourceError, IniciarBuscaResponse>> {
    const body: Record<string, unknown> = { numero_cnj: input.numero_cnj };
    if (input.tribunais !== undefined) body['tribunais'] = input.tribunais;

    const result = await this.http.request<unknown>('/api/v1/processos/pesquisar', {
      method: 'POST',
      body,
    });
    if (result._tag === 'Left') return result;
    const parsed = IniciarBuscaResponseSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
