import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { MonitoramentoDto } from '../dtos/MonitoramentoDto.js';
import { MonitoramentoDtoSchema } from '../dtos/MonitoramentoDto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IObterMonitoramento } from '../ports/IObterMonitoramento.js';

export class ObterMonitoramento implements IObterMonitoramento {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, MonitoramentoDto>> {
    const result = await this.http.request<unknown>(`/api/v1/monitoramentos/${input.id}`);
    if (isLeft(result)) return result;
    return parseOrSchemaError(MonitoramentoDtoSchema, result.value, 'escavador');
  }
}
