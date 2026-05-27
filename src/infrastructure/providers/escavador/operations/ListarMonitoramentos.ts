import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { ListarMonitoramentosResponse } from '../dtos/MonitoramentoDto.js';
import { ListarMonitoramentosResponseSchema } from '../dtos/MonitoramentoDto.js';

export interface IListarMonitoramentos {
  execute(input: { pagina?: number; ativo?: boolean }): Promise<
    Either<SourceError, ListarMonitoramentosResponse>
  >;
}

export class ListarMonitoramentos implements IListarMonitoramentos {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number; ativo?: boolean }): Promise<
    Either<SourceError, ListarMonitoramentosResponse>
  > {
    const result = await this.http.request<unknown>('/api/v1/monitoramentos', {
      params: { page: input.pagina, ativo: input.ativo },
    });
    if (result._tag === 'Left') return result;
    const parsed = ListarMonitoramentosResponseSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
