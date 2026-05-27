import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IIniciarBuscaProcessosLote, IniciarBuscaProcessosLoteInput } from '../ports/IIniciarBuscaProcessosLote.js';
import { IniciarBuscaResponseSchema, type IniciarBuscaResponse } from '../dtos/BuscaAssincronaDto.js';

export class IniciarBuscaProcessosLote implements IIniciarBuscaProcessosLote {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: IniciarBuscaProcessosLoteInput): Promise<Either<SourceError, IniciarBuscaResponse>> {
    const result = await this.http.request<unknown>('/api/v1/processos/pesquisar-em-lote', {
      method: 'POST',
      body: {
        itens: input.itens.map((i) => ({
          cpf_cnpj: i.cpfCnpj,
          nome: i.nome,
          oab: i.oab,
        })),
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
