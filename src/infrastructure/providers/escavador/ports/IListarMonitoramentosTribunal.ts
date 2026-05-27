// GET /api/v1/tribunal-monitoramentos
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ListarMonitoramentosTribunalResponse } from '../dtos/MonitoramentoDto.js';

export interface ListarMonitoramentosTribunalInput {
  pagina?: number;
  ativo?: boolean;
}

export interface IListarMonitoramentosTribunal {
  execute(
    input: ListarMonitoramentosTribunalInput,
  ): Promise<Either<SourceError, ListarMonitoramentosTribunalResponse>>;
}
