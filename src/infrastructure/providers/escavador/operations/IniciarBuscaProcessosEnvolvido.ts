import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type IniciarBuscaResponse,
  IniciarBuscaResponseSchema,
} from '../dtos/BuscaAssincronaDto.js';
import type {
  IIniciarBuscaProcessosEnvolvido,
  IniciarBuscaProcessosEnvolvidoInput,
} from '../ports/IIniciarBuscaProcessosEnvolvido.js';

export class IniciarBuscaProcessosEnvolvido implements IIniciarBuscaProcessosEnvolvido {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: IniciarBuscaProcessosEnvolvidoInput,
  ): Promise<Either<SourceError, IniciarBuscaResponse>> {
    const result = await this.http.request<unknown>('/api/v1/processos/pesquisar-por-nome', {
      method: 'POST',
      body: {
        nome: input.nome,
        tribunais: input.tribunais,
      },
    });

    if (result._tag === 'Left') return result;

    const parsed = IniciarBuscaResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
