import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IObterProcessosPessoa, ObterProcessosPessoaInput } from '../ports/IObterProcessosPessoa.js';
import { PessoaProcessosResponseSchema, type PessoaProcessosResponse } from '../dtos/PessoaDto.js';

export class ObterProcessosPessoa implements IObterProcessosPessoa {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: ObterProcessosPessoaInput): Promise<Either<SourceError, PessoaProcessosResponse>> {
    const result = await this.http.request<unknown>(`/api/v1/pessoas/${input.id}/processos`, {
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
