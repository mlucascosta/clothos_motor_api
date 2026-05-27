import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { MonitoramentoTribunalDto } from '../dtos/MonitoramentoDto.js';
import { MonitoramentoTribunalDtoSchema } from '../dtos/MonitoramentoDto.js';

export interface CriarMonitoramentoTribunalInput {
  tipo: string;
  identificador: string;
  tribunal: number;
  callback_url?: string;
}

export interface ICriarMonitoramentoTribunal {
  execute(
    input: CriarMonitoramentoTribunalInput,
  ): Promise<Either<SourceError, MonitoramentoTribunalDto>>;
}

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
    if (result._tag === 'Left') return result;
    const parsed = MonitoramentoTribunalDtoSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
