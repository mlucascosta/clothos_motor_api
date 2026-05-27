import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IObterDetalhesProcesso, ObterDetalhesProcessoInput } from '../ports/IObterDetalhesProcesso.js';
import { ProcessoDtoSchema, type ProcessoDto } from '../dtos/ProcessoDto.js';

export class ObterDetalhesProcesso implements IObterDetalhesProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: ObterDetalhesProcessoInput): Promise<Either<SourceError, ProcessoDto>> {
    const result = await this.http.request<unknown>(`/api/v1/processos/${input.numeroCnj}`);

    if (result._tag === 'Left') return result;

    const parsed = ProcessoDtoSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
