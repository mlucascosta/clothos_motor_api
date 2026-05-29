import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ResultadosMonitoramentoNovosProcessosResponse } from '../dtos/v2/MonitoramentoV2Dto.js';

export interface IObterResultadosMonitoramentoNovosProcessos {
  execute(input: { id: number; pagina?: number }): Promise<
    Either<SourceError, ResultadosMonitoramentoNovosProcessosResponse>
  >;
}
