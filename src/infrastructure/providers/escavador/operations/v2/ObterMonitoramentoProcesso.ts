import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type MonitoramentoProcessoDto,
  MonitoramentoProcessoDtoSchema,
} from '../../dtos/v2/MonitoramentoV2Dto.js';
import type { IObterMonitoramentoProcesso } from '../../ports/IObterMonitoramentoProcesso.js';

export class ObterMonitoramentoProcesso implements IObterMonitoramentoProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, MonitoramentoProcessoDto>> {
    const result = await this.http.request<unknown>(`/api/v2/monitoramentos/processos/${input.id}`);
    if (isLeft(result)) return result;
    return parseOrSchemaError(MonitoramentoProcessoDtoSchema, result.value, 'escavador-v2');
  }
}
