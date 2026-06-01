import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { MonitoramentoDto } from '../dtos/MonitoramentoDto.js';
import { MonitoramentoDtoSchema } from '../dtos/MonitoramentoDto.js';
import type {
  EditarMonitoramentoInput,
  IEditarMonitoramento,
} from '../ports/IEditarMonitoramento.js';

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
    if (isLeft(result)) return result;
    return parseOrSchemaError(MonitoramentoDtoSchema, result.value, 'escavador');
  }
}
