import { type Either, isLeft, right } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { IRemoverMonitoramentoNovosProcessos } from '../../ports/IRemoverMonitoramentoNovosProcessos.js';

export class RemoverMonitoramentoNovosProcessos implements IRemoverMonitoramentoNovosProcessos {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>(
      `/api/v2/monitoramentos/novos-processos/${input.id}`,
      { method: 'DELETE' },
    );
    if (isLeft(result)) return result;
    return right(undefined);
  }
}
