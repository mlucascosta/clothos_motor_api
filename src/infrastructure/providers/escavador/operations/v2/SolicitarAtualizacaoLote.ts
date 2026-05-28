import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { type AtualizacaoLoteDto, AtualizacaoLoteDtoSchema } from '../../dtos/v2/AtualizacaoDto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

export interface ISolicitarAtualizacaoLote {
  execute(input: { processos: Array<{ numero_cnj: string }>; enviar_callback?: boolean }): Promise<Either<SourceError, AtualizacaoLoteDto>>;
}

export class SolicitarAtualizacaoLote implements ISolicitarAtualizacaoLote {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { processos: Array<{ numero_cnj: string }>; enviar_callback?: boolean }): Promise<
    Either<SourceError, AtualizacaoLoteDto>
  > {
    const result = await this.http.request<unknown>('/api/v2/processos/lote/solicitar-atualizacao', {
      method: 'POST',
      body: { processos: input.processos, enviar_callback: input.enviar_callback ?? false },
    });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(AtualizacaoLoteDtoSchema, result.value, 'escavador-v2');
  }
}
