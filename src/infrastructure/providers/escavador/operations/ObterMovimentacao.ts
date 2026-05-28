import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { MovimentacaoDto } from '../dtos/MovimentacaoDto.js';
import { MovimentacaoDtoSchema } from '../dtos/MovimentacaoDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export interface IObterMovimentacao {
  execute(input: { id: number }): Promise<Either<SourceError, MovimentacaoDto>>;
}

export class ObterMovimentacao implements IObterMovimentacao {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, MovimentacaoDto>> {
    const result = await this.http.request<unknown>(`/api/v1/movimentacoes/${input.id}`);
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(MovimentacaoDtoSchema, result.value, 'escavador');
  }
}
