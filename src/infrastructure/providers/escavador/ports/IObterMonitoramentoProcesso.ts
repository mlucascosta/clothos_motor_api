import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { MonitoramentoProcessoDto } from '../dtos/v2/MonitoramentoV2Dto.js';

export interface IObterMonitoramentoProcesso {
  execute(input: { id: number }): Promise<Either<SourceError, MonitoramentoProcessoDto>>;
}
