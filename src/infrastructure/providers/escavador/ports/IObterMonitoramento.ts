// GET /api/v1/monitoramentos/{id}
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { MonitoramentoDto } from '../dtos/MonitoramentoDto.js';

export interface ObterMonitoramentoInput {
  id: number;
}

export interface IObterMonitoramento {
  execute(input: ObterMonitoramentoInput): Promise<Either<SourceError, MonitoramentoDto>>;
}
