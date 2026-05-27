// GET /api/v1/tribunal-monitoramentos/{id}
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { MonitoramentoTribunalDto } from '../dtos/MonitoramentoDto.js';

export interface ObterMonitoramentoTribunalInput {
  id: number;
}

export interface IObterMonitoramentoTribunal {
  execute(input: ObterMonitoramentoTribunalInput): Promise<Either<SourceError, MonitoramentoTribunalDto>>;
}
