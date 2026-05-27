import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IObterProcessosInstituicao, ObterProcessosInstituicaoInput } from '../ports/IObterProcessosInstituicao.js';
import { PessoaProcessosResponseSchema, type PessoaProcessosResponse } from '../dtos/PessoaDto.js';

export class ObterProcessosInstituicao implements IObterProcessosInstituicao {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: ObterProcessosInstituicaoInput): Promise<Either<SourceError, PessoaProcessosResponse>> {
    const result = await this.http.request<unknown>(`/api/v1/instituicoes/${input.id}/processos`, {
      params: {
        page: input.pagina,
      },
    });

    if (result._tag === 'Left') return result;

    const parsed = PessoaProcessosResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
