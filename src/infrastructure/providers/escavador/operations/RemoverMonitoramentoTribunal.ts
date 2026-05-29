import { isLeft, type Either, right } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { IRemoverMonitoramentoTribunal } from '../ports/IRemoverMonitoramentoTribunal.js';

export class RemoverMonitoramentoTribunal implements IRemoverMonitoramentoTribunal {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>(`/api/v1/tribunal-monitoramentos/${input.id}`, {
      method: 'DELETE',
    });
    if (isLeft(result)) return result;
    return right(undefined);
  }
}
