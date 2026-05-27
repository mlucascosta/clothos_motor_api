import { type Either, left, right } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type AtualizacaoProcessoDto,
  AtualizacaoProcessoDtoSchema,
} from '../../dtos/v2/AtualizacaoDto.js';

export interface ISolicitarAtualizacaoProcesso {
  execute(input: { id: number }): Promise<Either<SourceError, AtualizacaoProcessoDto>>;
}

export class SolicitarAtualizacaoProcesso implements ISolicitarAtualizacaoProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, AtualizacaoProcessoDto>> {
    const result = await this.http.request<unknown>(`/api/v2/processos/${input.id}/atualizacao`, {
      method: 'POST',
    });
    if (result._tag === 'Left') return result;
    const parsed = AtualizacaoProcessoDtoSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
