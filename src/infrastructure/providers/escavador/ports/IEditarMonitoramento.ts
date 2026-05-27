// PUT /api/v1/monitoramentos/{id}
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { MonitoramentoDto } from '../dtos/MonitoramentoDto.js';

export interface EditarMonitoramentoInput {
  id: number;
  ativo?: boolean;
  callback_url?: string;
  nome?: string;
}

export interface IEditarMonitoramento {
  execute(input: EditarMonitoramentoInput): Promise<Either<SourceError, MonitoramentoDto>>;
}
