import { right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';

export interface IRemoverMonitoramentoNovosProcessos {
  execute(input: { id: number }): Promise<Either<SourceError, void>>;
}

export class RemoverMonitoramentoNovosProcessos implements IRemoverMonitoramentoNovosProcessos {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>(`/api/v2/monitoramentos/novos-processos/${input.id}`, { method: 'DELETE' });
    if (result._tag === 'Left') return result;
    return right(undefined);
  }
}
