import { type Either, left, right } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type BuscaProcessosPorEnvolvidoResponse,
  BuscaProcessosPorEnvolvidoResponseSchema,
} from '../../dtos/v2/ProcessoV2Dto.js';

export interface IBuscarProcessosPorEnvolvido {
  execute(input: { nome?: string; cpf_cnpj?: string; cursor?: string; li?: string }): Promise<
    Either<SourceError, BuscaProcessosPorEnvolvidoResponse>
  >;
}

export class BuscarProcessosPorEnvolvido implements IBuscarProcessosPorEnvolvido {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { nome?: string; cpf_cnpj?: string; pagina?: number; cursor?: string; li?: string }): Promise<
    Either<SourceError, BuscaProcessosPorEnvolvidoResponse>
  > {
    const params: Record<string, string | number | boolean | undefined> = { limit: 50 };
    if (input.nome !== undefined) params['nome'] = input.nome;
    if (input.cpf_cnpj !== undefined) params['cpf_cnpj'] = input.cpf_cnpj;
    if (input.cursor !== undefined) params['cursor'] = input.cursor;
    if (input.li !== undefined) params['li'] = input.li;

    const result = await this.http.request<unknown>('/api/v2/envolvido/processos', { params });
    if (result._tag === 'Left') return result;
    const parsed = BuscaProcessosPorEnvolvidoResponseSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
