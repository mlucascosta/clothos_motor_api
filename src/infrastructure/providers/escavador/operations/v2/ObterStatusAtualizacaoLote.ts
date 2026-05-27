import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { AtualizacaoLoteDtoSchema, type AtualizacaoLoteDto } from '../../dtos/v2/AtualizacaoDto.js';

export interface IObterStatusAtualizacaoLote {
  execute(input: { id: number }): Promise<Either<SourceError, AtualizacaoLoteDto>>;
}

export class ObterStatusAtualizacaoLote implements IObterStatusAtualizacaoLote {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, AtualizacaoLoteDto>> {
    const result = await this.http.request<unknown>(`/api/v2/processos/atualizacao/${input.id}`);
    if (result._tag === 'Left') return result;
    const parsed = AtualizacaoLoteDtoSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
