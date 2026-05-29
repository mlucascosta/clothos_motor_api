import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';

export interface IRemoverMonitoramentoNovosProcessos {
  execute(input: { id: number }): Promise<Either<SourceError, void>>;
}
