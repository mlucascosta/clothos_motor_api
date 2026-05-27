// POST /api/v1/tribunal-monitoramentos
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { MonitoramentoTribunalDto } from '../dtos/MonitoramentoDto.js';

export interface CriarMonitoramentoTribunalInput {
  tipo: string;
  identificador: string;
  tribunal: string;
  callback_url?: string;
}

export interface ICriarMonitoramentoTribunal {
  execute(input: CriarMonitoramentoTribunalInput): Promise<Either<SourceError, MonitoramentoTribunalDto>>;
}
