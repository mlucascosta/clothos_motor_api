// DELETE /api/v1/monitoramentos/{id} → 204 No Content
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';

export interface RemoverMonitoramentoInput {
  id: number;
}

export interface IRemoverMonitoramento {
  execute(input: RemoverMonitoramentoInput): Promise<Either<SourceError, void>>;
}
