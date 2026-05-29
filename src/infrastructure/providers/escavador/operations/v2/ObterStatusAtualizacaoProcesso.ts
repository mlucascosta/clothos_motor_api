import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type AtualizacaoProcessoDto,
  AtualizacaoProcessoDtoSchema,
} from '../../dtos/v2/AtualizacaoDto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IObterStatusAtualizacaoProcesso } from '../../ports/IObterStatusAtualizacaoProcesso.js';

export class ObterStatusAtualizacaoProcesso implements IObterStatusAtualizacaoProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: string }): Promise<Either<SourceError, AtualizacaoProcessoDto>> {
    const result = await this.http.request<unknown>(
      `/api/v2/processos/numero_cnj/${encodeURIComponent(input.id)}/status-atualizacao`,
    );
    if (isLeft(result)) return result;
    return parseOrSchemaError(AtualizacaoProcessoDtoSchema, result.value, 'escavador-v2');
  }
}
