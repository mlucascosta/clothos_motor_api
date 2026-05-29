import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { MonitoramentoProcessoDto } from '../dtos/v2/MonitoramentoV2Dto.js';

export interface ICriarMonitoramentoProcesso {
  execute(input: { processo_id: number; callback_url?: string }): Promise<
    Either<SourceError, MonitoramentoProcessoDto>
  >;
}
