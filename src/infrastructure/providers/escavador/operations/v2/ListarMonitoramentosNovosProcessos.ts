import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type ListarMonitoramentosNovosProcessosResponse,
  ListarMonitoramentosNovosProcessosResponseSchema,
} from '../../dtos/v2/MonitoramentoV2Dto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IListarMonitoramentosNovosProcessos } from '../../ports/IListarMonitoramentosNovosProcessos.js';

export class ListarMonitoramentosNovosProcessos implements IListarMonitoramentosNovosProcessos {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<
    Either<SourceError, ListarMonitoramentosNovosProcessosResponse>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>('/api/v2/monitoramentos/novos-processos', {
      params,
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarMonitoramentosNovosProcessosResponseSchema, result.value, 'escavador-v2');
  }
}
