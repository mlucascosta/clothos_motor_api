import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { type AtualizacaoLoteDto, AtualizacaoLoteDtoSchema } from '../../dtos/v2/AtualizacaoDto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

export interface IObterStatusAtualizacaoLote {
  execute(input: { id: number }): Promise<Either<SourceError, AtualizacaoLoteDto>>;
}

export class ObterStatusAtualizacaoLote implements IObterStatusAtualizacaoLote {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, AtualizacaoLoteDto>> {
    const result = await this.http.request<unknown>(`/api/v2/processos/atualizacao/${input.id}`);
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(AtualizacaoLoteDtoSchema, result.value, 'escavador-v2');
  }
}
