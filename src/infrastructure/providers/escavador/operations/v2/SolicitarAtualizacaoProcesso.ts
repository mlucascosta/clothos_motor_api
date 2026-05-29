import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type AtualizacaoProcessoDto,
  AtualizacaoProcessoDtoSchema,
} from '../../dtos/v2/AtualizacaoDto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { ISolicitarAtualizacaoProcesso } from '../../ports/ISolicitarAtualizacaoProcesso.js';

export class SolicitarAtualizacaoProcesso implements ISolicitarAtualizacaoProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: string }): Promise<Either<SourceError, AtualizacaoProcessoDto>> {
    const result = await this.http.request<unknown>(
      `/api/v2/processos/numero_cnj/${encodeURIComponent(input.id)}/solicitar-atualizacao`,
      { method: 'POST', body: { enviar_callback: false } },
    );
    if (isLeft(result)) return result;
    return parseOrSchemaError(AtualizacaoProcessoDtoSchema, result.value, 'escavador-v2');
  }
}
