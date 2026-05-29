import { isLeft, type Either, right } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { IMarcarCallbacksRecebidosV2 } from '../../ports/IMarcarCallbacksRecebidosV2.js';

export class MarcarCallbacksRecebidosV2 implements IMarcarCallbacksRecebidosV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { ids: number[] }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>('/api/v2/callbacks/recebidos', {
      method: 'POST',
      body: { ids: input.ids },
    });
    if (isLeft(result)) return result;
    return right(undefined);
  }
}
