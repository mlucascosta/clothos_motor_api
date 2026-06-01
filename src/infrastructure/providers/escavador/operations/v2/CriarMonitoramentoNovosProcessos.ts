import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type MonitoramentoNovosProcessosDto,
  MonitoramentoNovosProcessosDtoSchema,
} from '../../dtos/v2/MonitoramentoV2Dto.js';
import type { ICriarMonitoramentoNovosProcessos } from '../../ports/ICriarMonitoramentoNovosProcessos.js';

export class CriarMonitoramentoNovosProcessos implements ICriarMonitoramentoNovosProcessos {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: {
    variacao_busca: string;
    tribunais?: number[];
    callback_url?: string;
  }): Promise<Either<SourceError, MonitoramentoNovosProcessosDto>> {
    const body: Record<string, unknown> = { variacao_busca: input.variacao_busca };
    if (input.tribunais !== undefined) body['tribunais'] = input.tribunais;
    if (input.callback_url !== undefined) body['callback_url'] = input.callback_url;

    const result = await this.http.request<unknown>('/api/v2/monitoramentos/novos-processos', {
      method: 'POST',
      body,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(MonitoramentoNovosProcessosDtoSchema, result.value, 'escavador-v2');
  }
}
