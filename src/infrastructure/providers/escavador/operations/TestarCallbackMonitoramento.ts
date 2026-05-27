import { right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';

export interface ITestarCallbackMonitoramento {
  execute(input: { id: number }): Promise<Either<SourceError, void>>;
}

export class TestarCallbackMonitoramento implements ITestarCallbackMonitoramento {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>(
      `/api/v1/monitoramentos/${input.id}/testar-callback`,
      { method: 'POST' },
    );
    if (result._tag === 'Left') return result;
    return right(undefined);
  }
}
