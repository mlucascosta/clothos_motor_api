import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { MonitoramentoTribunalDto } from '../dtos/MonitoramentoDto.js';
import { MonitoramentoTribunalDtoSchema } from '../dtos/MonitoramentoDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';

export interface EditarMonitoramentoTribunalInput {
  id: number;
  ativo?: boolean;
  callback_url?: string;
}

export interface IEditarMonitoramentoTribunal {
  execute(
    input: EditarMonitoramentoTribunalInput,
  ): Promise<Either<SourceError, MonitoramentoTribunalDto>>;
}

export class EditarMonitoramentoTribunal implements IEditarMonitoramentoTribunal {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: EditarMonitoramentoTribunalInput,
  ): Promise<Either<SourceError, MonitoramentoTribunalDto>> {
    const result = await this.http.request<unknown>(`/api/v1/tribunal-monitoramentos/${input.id}`, {
      method: 'PUT',
      body: {
        ativo: input.ativo,
        callback_url: input.callback_url,
      },
    });
    if (result._tag === 'Left') return result;
    return parseOrSchemaError(MonitoramentoTribunalDtoSchema, result.value, 'escavador');
  }
}
