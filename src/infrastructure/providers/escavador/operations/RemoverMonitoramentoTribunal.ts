import { right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';

export interface IRemoverMonitoramentoTribunal {
  execute(input: { id: number }): Promise<Either<SourceError, void>>;
}

export class RemoverMonitoramentoTribunal implements IRemoverMonitoramentoTribunal {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>(`/api/v1/tribunal-monitoramentos/${input.id}`, {
      method: 'DELETE',
    });
    if (result._tag === 'Left') return result;
    return right(undefined);
  }
}
