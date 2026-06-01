import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { ListarMonitoramentosResponse } from '../dtos/MonitoramentoDto.js';
import { ListarMonitoramentosResponseSchema } from '../dtos/MonitoramentoDto.js';
import type { IListarMonitoramentos } from '../ports/IListarMonitoramentos.js';

export class ListarMonitoramentos implements IListarMonitoramentos {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number; ativo?: boolean }): Promise<
    Either<SourceError, ListarMonitoramentosResponse>
  > {
    const result = await this.http.request<unknown>('/api/v1/monitoramentos', {
      params: { page: input.pagina, ativo: input.ativo },
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarMonitoramentosResponseSchema, result.value, 'escavador');
  }
}
