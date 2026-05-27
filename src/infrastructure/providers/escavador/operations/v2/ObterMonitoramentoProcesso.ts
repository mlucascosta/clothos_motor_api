import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { MonitoramentoProcessoDtoSchema, type MonitoramentoProcessoDto } from '../../dtos/v2/MonitoramentoV2Dto.js';

export interface IObterMonitoramentoProcesso {
  execute(input: { id: number }): Promise<Either<SourceError, MonitoramentoProcessoDto>>;
}

export class ObterMonitoramentoProcesso implements IObterMonitoramentoProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, MonitoramentoProcessoDto>> {
    const result = await this.http.request<unknown>(`/api/v2/monitoramentos/processos/${input.id}`);
    if (result._tag === 'Left') return result;
    const parsed = MonitoramentoProcessoDtoSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
