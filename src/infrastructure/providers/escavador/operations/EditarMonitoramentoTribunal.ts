import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { MonitoramentoTribunalDto } from '../dtos/MonitoramentoDto.js';
import { MonitoramentoTribunalDtoSchema } from '../dtos/MonitoramentoDto.js';
import type {
  EditarMonitoramentoTribunalInput,
  IEditarMonitoramentoTribunal,
} from '../ports/IEditarMonitoramentoTribunal.js';

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
    if (isLeft(result)) return result;
    return parseOrSchemaError(MonitoramentoTribunalDtoSchema, result.value, 'escavador');
  }
}
