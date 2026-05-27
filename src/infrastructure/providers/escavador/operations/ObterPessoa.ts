import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IObterPessoa, ObterPessoaInput } from '../ports/IObterPessoa.js';
import { PessoaDtoSchema, type PessoaDto } from '../dtos/PessoaDto.js';

export class ObterPessoa implements IObterPessoa {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: ObterPessoaInput): Promise<Either<SourceError, PessoaDto>> {
    const result = await this.http.request<unknown>(`/api/v1/pessoas/${input.id}`);

    if (result._tag === 'Left') return result;

    const parsed = PessoaDtoSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
