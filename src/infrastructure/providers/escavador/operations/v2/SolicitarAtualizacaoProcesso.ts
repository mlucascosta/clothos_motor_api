import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type AtualizacaoProcessoDto,
  AtualizacaoProcessoDtoSchema,
} from '../../dtos/v2/AtualizacaoDto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

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
    return parseOrSchemaError(AtualizacaoProcessoDtoSchema, result.value, 'escavador-v2');
  }
}
