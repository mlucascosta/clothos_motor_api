import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { MonitoramentoDto } from '../dtos/MonitoramentoDto.js';
import { MonitoramentoDtoSchema } from '../dtos/MonitoramentoDto.js';

export interface CriarMonitoramentoInput {
  nome: string;
  tipo: string;
  identificador: string;
  callback_url?: string;
  tribunais?: number[];
}

export interface ICriarMonitoramento {
  execute(input: CriarMonitoramentoInput): Promise<Either<SourceError, MonitoramentoDto>>;
}

export class CriarMonitoramento implements ICriarMonitoramento {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: CriarMonitoramentoInput): Promise<Either<SourceError, MonitoramentoDto>> {
    const result = await this.http.request<unknown>('/api/v1/monitoramentos', {
      method: 'POST',
      body: {
        nome: input.nome,
        tipo: input.tipo,
        identificador: input.identificador,
        callback_url: input.callback_url,
        tribunais: input.tribunais,
      },
    });
    if (result._tag === 'Left') return result;
    const parsed = MonitoramentoDtoSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
