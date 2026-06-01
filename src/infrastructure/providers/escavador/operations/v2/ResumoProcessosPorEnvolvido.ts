import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { z } from 'zod';
import type { IResumoProcessosPorEnvolvido } from '../../ports/IResumoProcessosPorEnvolvido.js';

const ResumoEnvolvidoSchema = z.record(z.unknown());
export type ResumoEnvolvido = z.infer<typeof ResumoEnvolvidoSchema>;

export class ResumoProcessosPorEnvolvido implements IResumoProcessosPorEnvolvido {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { nome?: string; cpf_cnpj?: string }): Promise<
    Either<SourceError, ResumoEnvolvido>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.nome !== undefined) params['nome'] = input.nome;
    if (input.cpf_cnpj !== undefined) params['cpf_cnpj'] = input.cpf_cnpj;

    const result = await this.http.request<unknown>('/api/v2/envolvido/resumo', { params });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ResumoEnvolvidoSchema, result.value, 'escavador-v2');
  }
}
