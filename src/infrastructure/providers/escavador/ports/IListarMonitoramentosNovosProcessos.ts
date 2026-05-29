import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ListarMonitoramentosNovosProcessosResponse } from '../dtos/v2/MonitoramentoV2Dto.js';

export interface IListarMonitoramentosNovosProcessos {
  execute(input: { pagina?: number }): Promise<
    Either<SourceError, ListarMonitoramentosNovosProcessosResponse>
  >;
}
