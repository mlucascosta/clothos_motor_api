import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { OrigensMonitoramentoResponse } from '../operations/ObterOrigensMonitoramento.js';

export type { OrigensMonitoramentoResponse };

export interface IObterOrigensMonitoramento {
  execute(input: { id: number }): Promise<Either<SourceError, OrigensMonitoramentoResponse>>;
}
