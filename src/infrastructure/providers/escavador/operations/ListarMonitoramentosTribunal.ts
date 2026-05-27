import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { ListarMonitoramentosTribunalResponse } from '../dtos/MonitoramentoDto.js';
import { ListarMonitoramentosTribunalResponseSchema } from '../dtos/MonitoramentoDto.js';

export interface IListarMonitoramentosTribunal {
  execute(input: { pagina?: number; ativo?: boolean }): Promise<Either<SourceError, ListarMonitoramentosTribunalResponse>>;
}

export class ListarMonitoramentosTribunal implements IListarMonitoramentosTribunal {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number; ativo?: boolean }): Promise<Either<SourceError, ListarMonitoramentosTribunalResponse>> {
    const result = await this.http.request<unknown>('/api/v1/tribunal-monitoramentos', {
      params: { page: input.pagina, ativo: input.ativo },
    });
    if (result._tag === 'Left') return result;
    const parsed = ListarMonitoramentosTribunalResponseSchema.safeParse(result.value);
    if (!parsed.success) return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
