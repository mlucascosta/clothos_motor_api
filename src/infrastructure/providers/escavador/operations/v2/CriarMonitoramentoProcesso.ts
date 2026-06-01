import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type MonitoramentoProcessoDto,
  MonitoramentoProcessoDtoSchema,
} from '../../dtos/v2/MonitoramentoV2Dto.js';
import type { ICriarMonitoramentoProcesso } from '../../ports/ICriarMonitoramentoProcesso.js';

export class CriarMonitoramentoProcesso implements ICriarMonitoramentoProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { processo_id: number; callback_url?: string }): Promise<
    Either<SourceError, MonitoramentoProcessoDto>
  > {
    const body: Record<string, unknown> = { processo_id: input.processo_id };
    if (input.callback_url !== undefined) body['callback_url'] = input.callback_url;

    const result = await this.http.request<unknown>('/api/v2/monitoramentos/processos', {
      method: 'POST',
      body,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(MonitoramentoProcessoDtoSchema, result.value, 'escavador-v2');
  }
}
