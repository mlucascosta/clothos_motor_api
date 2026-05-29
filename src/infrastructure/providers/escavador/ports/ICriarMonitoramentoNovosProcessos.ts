import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { MonitoramentoNovosProcessosDto } from '../dtos/v2/MonitoramentoV2Dto.js';

export interface ICriarMonitoramentoNovosProcessos {
  execute(input: { variacao_busca: string; tribunais?: number[]; callback_url?: string }): Promise<
    Either<SourceError, MonitoramentoNovosProcessosDto>
  >;
}
