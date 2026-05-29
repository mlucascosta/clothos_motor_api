import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ListarMonitoramentosProcessoResponse } from '../dtos/v2/MonitoramentoV2Dto.js';

export interface IListarMonitoramentosProcesso {
  execute(input: { pagina?: number }): Promise<
    Either<SourceError, ListarMonitoramentosProcessoResponse>
  >;
}
