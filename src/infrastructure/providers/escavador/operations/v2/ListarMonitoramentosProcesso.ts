import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import { ListarMonitoramentosProcessoResponseSchema, type ListarMonitoramentosProcessoResponse } from '../../dtos/v2/MonitoramentoV2Dto.js';

export interface IListarMonitoramentosProcesso {
  execute(input: { pagina?: number }): Promise<Either<SourceError, ListarMonitoramentosProcessoResponse>>;
}

export class ListarMonitoramentosProcesso implements IListarMonitoramentosProcesso {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<Either<SourceError, ListarMonitoramentosProcessoResponse>> {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>('/api/v2/monitoramentos/processos', { params });
    if (result._tag === 'Left') return result;
    const parsed = ListarMonitoramentosProcessoResponseSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
