import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { MonitoramentoNovosProcessosDto } from '../dtos/v2/MonitoramentoV2Dto.js';

export interface IObterMonitoramentoNovosProcessos {
  execute(input: { id: number }): Promise<Either<SourceError, MonitoramentoNovosProcessosDto>>;
}
