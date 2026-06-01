import { type Either, isLeft, right } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { IMarcarCallbacksRecebidos } from '../ports/IMarcarCallbacksRecebidos.js';

export class MarcarCallbacksRecebidos implements IMarcarCallbacksRecebidos {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { ids: number[] }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>('/api/v1/callbacks/marcar-recebidos', {
      method: 'POST',
      body: { ids: input.ids },
    });
    if (isLeft(result)) return result;
    return right(undefined);
  }
}
