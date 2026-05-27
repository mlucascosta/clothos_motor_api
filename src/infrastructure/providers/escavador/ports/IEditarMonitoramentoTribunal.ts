// PUT /api/v1/tribunal-monitoramentos/{id}
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { MonitoramentoTribunalDto } from '../dtos/MonitoramentoDto.js';

export interface EditarMonitoramentoTribunalInput {
  id: number;
  ativo?: boolean;
  callback_url?: string;
}

export interface IEditarMonitoramentoTribunal {
  execute(input: EditarMonitoramentoTribunalInput): Promise<Either<SourceError, MonitoramentoTribunalDto>>;
}
