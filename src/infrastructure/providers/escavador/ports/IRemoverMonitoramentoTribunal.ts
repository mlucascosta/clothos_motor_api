// DELETE /api/v1/tribunal-monitoramentos/{id}
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';

export interface RemoverMonitoramentoTribunalInput {
  id: number;
}

export interface IRemoverMonitoramentoTribunal {
  execute(input: RemoverMonitoramentoTribunalInput): Promise<Either<SourceError, void>>;
}
