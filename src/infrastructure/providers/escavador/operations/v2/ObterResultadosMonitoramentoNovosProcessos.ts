import { type Either, left, right } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';
import {
  type ResultadosMonitoramentoNovosProcessosResponse,
  ResultadosMonitoramentoNovosProcessosResponseSchema,
} from '../../dtos/v2/MonitoramentoV2Dto.js';

export interface IObterResultadosMonitoramentoNovosProcessos {
  execute(input: { id: number; pagina?: number }): Promise<
    Either<SourceError, ResultadosMonitoramentoNovosProcessosResponse>
  >;
}

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
    if (result._tag === 'Left') return result;
    const parsed = ResultadosMonitoramentoNovosProcessosResponseSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador-v2', parsed.error.message));
    return right(parsed.data);
  }
}
