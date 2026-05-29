import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { MonitoramentoTribunalDto } from '../dtos/MonitoramentoDto.js';
import { MonitoramentoTribunalDtoSchema } from '../dtos/MonitoramentoDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IObterMonitoramentoTribunal } from '../ports/IObterMonitoramentoTribunal.js';

export class ObterMonitoramentoTribunal implements IObterMonitoramentoTribunal {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, MonitoramentoTribunalDto>> {
    const result = await this.http.request<unknown>(`/api/v1/tribunal-monitoramentos/${input.id}`);
    if (isLeft(result)) return result;
    return parseOrSchemaError(MonitoramentoTribunalDtoSchema, result.value, 'escavador');
  }
}
