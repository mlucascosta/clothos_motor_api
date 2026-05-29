import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import {
  type ResultadosMonitoramentoNovosProcessosResponse,
  ResultadosMonitoramentoNovosProcessosResponseSchema,
} from '../../dtos/v2/MonitoramentoV2Dto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IObterResultadosMonitoramentoNovosProcessos } from '../../ports/IObterResultadosMonitoramentoNovosProcessos.js';

export class ObterResultadosMonitoramentoNovosProcessos
  implements IObterResultadosMonitoramentoNovosProcessos
{
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number; pagina?: number }): Promise<
    Either<SourceError, ResultadosMonitoramentoNovosProcessosResponse>
  > {
    const params: Record<string, string | number | boolean | undefined> = {};
    if (input.pagina !== undefined) params['page'] = input.pagina;

    const result = await this.http.request<unknown>(
      `/api/v2/monitoramentos/novos-processos/${input.id}/resultados`,
      { params },
    );
    if (isLeft(result)) return result;
    return parseOrSchemaError(ResultadosMonitoramentoNovosProcessosResponseSchema, result.value, 'escavador-v2');
  }
}
