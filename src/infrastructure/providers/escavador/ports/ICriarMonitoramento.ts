// POST /api/v1/monitoramentos
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { MonitoramentoDto, CriarMonitoramentoInput } from '../dtos/MonitoramentoDto.js';

export type { CriarMonitoramentoInput };

export interface ICriarMonitoramento {
  execute(input: CriarMonitoramentoInput): Promise<Either<SourceError, MonitoramentoDto>>;
}
