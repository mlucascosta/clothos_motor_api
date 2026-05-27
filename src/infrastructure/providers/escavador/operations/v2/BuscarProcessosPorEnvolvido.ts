import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { ProcessoV2ResumoSchema, type ProcessoV2Resumo } from '../../dtos/v2/ProcessoV2Dto.js';

export interface IBuscarProcessosPorEnvolvido {
  execute(input: { nome?: string; cpf_cnpj?: string; pagina?: number }): Promise<Either<SourceError, ProcessoV2Resumo>>;
}

export class BuscarProcessosPorEnvolvido implements IBuscarProcessosPorEnvolvido {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { nome?: string; cpf_cnpj?: string; pagina?: number }): Promise<Either<SourceError, ProcessoV2Resumo>> {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.nome !== undefined) params['nome'] = input.nome;
    if (input.cpf_cnpj !== undefined) params['cpf_cnpj'] = input.cpf_cnpj;
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>('/api/v2/processos/envolvido', { params });
    if (result._tag === 'Left') return result;
    const parsed = ProcessoV2ResumoSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
