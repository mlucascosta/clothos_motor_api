import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { MonitoramentoTribunalDto } from '../dtos/MonitoramentoDto.js';
import { MonitoramentoTribunalDtoSchema } from '../dtos/MonitoramentoDto.js';

export interface IObterMonitoramentoTribunal {
  execute(input: { id: number }): Promise<Either<SourceError, MonitoramentoTribunalDto>>;
}

export class ObterMonitoramentoTribunal implements IObterMonitoramentoTribunal {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, MonitoramentoTribunalDto>> {
    const result = await this.http.request<unknown>(`/api/v1/tribunal-monitoramentos/${input.id}`);
    if (result._tag === 'Left') return result;
    const parsed = MonitoramentoTribunalDtoSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
