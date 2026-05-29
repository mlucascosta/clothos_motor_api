import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { ListarMonitoramentosTribunalResponse } from '../dtos/MonitoramentoDto.js';
import { ListarMonitoramentosTribunalResponseSchema } from '../dtos/MonitoramentoDto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IListarMonitoramentosTribunal } from '../ports/IListarMonitoramentosTribunal.js';

export class ListarMonitoramentosTribunal implements IListarMonitoramentosTribunal {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number; ativo?: boolean }): Promise<
    Either<SourceError, ListarMonitoramentosTribunalResponse>
  > {
    const result = await this.http.request<unknown>('/api/v1/tribunal-monitoramentos', {
      params: { page: input.pagina, ativo: input.ativo },
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarMonitoramentosTribunalResponseSchema, result.value, 'escavador');
  }
}
