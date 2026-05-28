import type { Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type ListarMonitoramentosProcessoResponse,
  ListarMonitoramentosProcessoResponseSchema,
} from '../../dtos/v2/MonitoramentoV2Dto.js';
import { parseOrSchemaError } from '../../../../../shared/domain/parseOrSchemaError.js';

export interface IListarMonitoramentosProcesso {
  execute(input: { pagina?: number }): Promise<
    Either<SourceError, ListarMonitoramentosProcessoResponse>
  >;
}

export class ListarMonitoramentosProcesso implements IListarMonitoramentosProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<
    Either<SourceError, ListarMonitoramentosProcessoResponse>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>('/api/v2/monitoramentos/processos', { params });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(ListarMonitoramentosProcessoResponseSchema, result.value, 'escavador-v2');
  }
}
