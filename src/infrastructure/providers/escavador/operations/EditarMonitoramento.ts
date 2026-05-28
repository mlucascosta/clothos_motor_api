import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { MonitoramentoDto } from '../dtos/MonitoramentoDto.js';
import { MonitoramentoDtoSchema } from '../dtos/MonitoramentoDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export interface EditarMonitoramentoInput {
  id: number;
  ativo?: boolean;
  callback_url?: string;
  nome?: string;
}

export interface IEditarMonitoramento {
  execute(input: EditarMonitoramentoInput): Promise<Either<SourceError, MonitoramentoDto>>;
}

export class EditarMonitoramento implements IEditarMonitoramento {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: EditarMonitoramentoInput): Promise<Either<SourceError, MonitoramentoDto>> {
    const result = await this.http.request<unknown>(`/api/v1/monitoramentos/${input.id}`, {
      method: 'PUT',
      body: {
        ativo: input.ativo,
        callback_url: input.callback_url,
        nome: input.nome,
      },
    });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(MonitoramentoDtoSchema, result.value, 'escavador');
  }
}
