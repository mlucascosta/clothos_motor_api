// GET /api/v1/monitoramentos
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ListarMonitoramentosResponse } from '../dtos/MonitoramentoDto.js';

export interface ListarMonitoramentosInput {
  pagina?: number;
  ativo?: boolean;
}

export interface IListarMonitoramentos {
  execute(input: ListarMonitoramentosInput): Promise<Either<SourceError, ListarMonitoramentosResponse>>;
}
