import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type MonitoramentoNovosProcessosDto,
  MonitoramentoNovosProcessosDtoSchema,
} from '../../dtos/v2/MonitoramentoV2Dto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

export interface IObterMonitoramentoNovosProcessos {
  execute(input: { id: number }): Promise<Either<SourceError, MonitoramentoNovosProcessosDto>>;
}

export class ObterMonitoramentoNovosProcessos implements IObterMonitoramentoNovosProcessos {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<
    Either<SourceError, MonitoramentoNovosProcessosDto>
  > {
    const result = await this.http.request<unknown>(
      `/api/v2/monitoramentos/novos-processos/${input.id}`,
    );
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(MonitoramentoNovosProcessosDtoSchema, result.value, 'escavador-v2');
  }
}
