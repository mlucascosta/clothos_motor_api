import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type ListarMonitoramentosProcessoResponse,
  ListarMonitoramentosProcessoResponseSchema,
} from '../../dtos/v2/MonitoramentoV2Dto.js';
import type { IListarMonitoramentosProcesso } from '../../ports/IListarMonitoramentosProcesso.js';

export class ListarMonitoramentosProcesso implements IListarMonitoramentosProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<
    Either<SourceError, ListarMonitoramentosProcessoResponse>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>('/api/v2/monitoramentos/processos', { params });
    if (isLeft(result)) return result;
    return parseOrSchemaError(
      ListarMonitoramentosProcessoResponseSchema,
      result.value,
      'escavador-v2',
    );
  }
}
