import { isLeft, type Either, right } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { IRemoverMonitoramento } from '../ports/IRemoverMonitoramento.js';

export class RemoverMonitoramento implements IRemoverMonitoramento {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>(`/api/v1/monitoramentos/${input.id}`, {
      method: 'DELETE',
    });
    if (isLeft(result)) return result;
    return right(undefined);
  }
}
