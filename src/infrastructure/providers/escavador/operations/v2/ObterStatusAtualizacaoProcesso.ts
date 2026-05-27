import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { AtualizacaoProcessoDtoSchema, type AtualizacaoProcessoDto } from '../../dtos/v2/AtualizacaoDto.js';

export interface IObterStatusAtualizacaoProcesso {
  execute(input: { id: number }): Promise<Either<SourceError, AtualizacaoProcessoDto>>;
}

export class ObterStatusAtualizacaoProcesso implements IObterStatusAtualizacaoProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, AtualizacaoProcessoDto>> {
    const result = await this.http.request<unknown>(`/api/v2/processos/${input.id}/atualizacao`);
    if (result._tag === 'Left') return result;
    const parsed = AtualizacaoProcessoDtoSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
