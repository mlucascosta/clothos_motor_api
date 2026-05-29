import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { MovimentacaoDto } from '../dtos/MovimentacaoDto.js';
import { MovimentacaoDtoSchema } from '../dtos/MovimentacaoDto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IObterMovimentacao } from '../ports/IObterMovimentacao.js';

export class ObterMovimentacao implements IObterMovimentacao {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, MovimentacaoDto>> {
    const result = await this.http.request<unknown>(`/api/v1/movimentacoes/${input.id}`);
    if (isLeft(result)) return result;
    return parseOrSchemaError(MovimentacaoDtoSchema, result.value, 'escavador');
  }
}
