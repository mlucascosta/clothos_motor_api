import { isLeft } from '../../../../../shared/domain/Either.js';
import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { type AtualizacaoLoteDto, AtualizacaoLoteDtoSchema } from '../../dtos/v2/AtualizacaoDto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';
import type { IObterStatusAtualizacaoLote } from '../../ports/IObterStatusAtualizacaoLote.js';

export class ObterStatusAtualizacaoLote implements IObterStatusAtualizacaoLote {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, AtualizacaoLoteDto>> {
    const result = await this.http.request<unknown>(`/api/v2/processos/lote/${input.id}/status`);
    if (isLeft(result)) return result;
    return parseOrSchemaError(AtualizacaoLoteDtoSchema, result.value, 'escavador-v2');
  }
}
