import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type MonitoramentoNovosProcessosDto,
  MonitoramentoNovosProcessosDtoSchema,
} from '../../dtos/v2/MonitoramentoV2Dto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IObterMonitoramentoNovosProcessos } from '../../ports/IObterMonitoramentoNovosProcessos.js';

export class ObterMonitoramentoNovosProcessos implements IObterMonitoramentoNovosProcessos {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<
    Either<SourceError, MonitoramentoNovosProcessosDto>
  > {
    const result = await this.http.request<unknown>(
      `/api/v2/monitoramentos/novos-processos/${input.id}`,
    );
    if (isLeft(result)) return result;
    return parseOrSchemaError(MonitoramentoNovosProcessosDtoSchema, result.value, 'escavador-v2');
  }
}
