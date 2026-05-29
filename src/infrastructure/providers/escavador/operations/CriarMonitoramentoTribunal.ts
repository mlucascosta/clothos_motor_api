import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { MonitoramentoTribunalDto } from '../dtos/MonitoramentoDto.js';
import { MonitoramentoTribunalDtoSchema } from '../dtos/MonitoramentoDto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { ICriarMonitoramentoTribunal, CriarMonitoramentoTribunalInput } from '../ports/ICriarMonitoramentoTribunal.js';

export class CriarMonitoramentoTribunal implements ICriarMonitoramentoTribunal {
  constructor(private readonly http: IHttpClient) {}

  async execute(
    input: CriarMonitoramentoTribunalInput,
  ): Promise<Either<SourceError, MonitoramentoTribunalDto>> {
    const result = await this.http.request<unknown>('/api/v1/tribunal-monitoramentos', {
      method: 'POST',
      body: {
        tipo: input.tipo,
        identificador: input.identificador,
        tribunal: input.tribunal,
        callback_url: input.callback_url,
      },
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(MonitoramentoTribunalDtoSchema, result.value, 'escavador');
  }
}
