import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import {
  type IniciarBuscaResponse,
  IniciarBuscaResponseSchema,
} from '../dtos/BuscaAssincronaDto.js';
import type {
  IIniciarBuscaProcessosOab,
  IniciarBuscaProcessosOabInput,
} from '../ports/IIniciarBuscaProcessosOab.js';

export class IniciarBuscaProcessosOab implements IIniciarBuscaProcessosOab {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: IniciarBuscaProcessosOabInput,
  ): Promise<Either<SourceError, IniciarBuscaResponse>> {
    const result = await this.http.request<unknown>('/api/v1/processos/pesquisar-por-oab', {
      method: 'POST',
      body: {
        oab: input.oab,
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
