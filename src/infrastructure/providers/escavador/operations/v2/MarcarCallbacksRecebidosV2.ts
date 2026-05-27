import { right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';

export interface IMarcarCallbacksRecebidosV2 {
  execute(input: { ids: number[] }): Promise<Either<SourceError, void>>;
}

export class MarcarCallbacksRecebidosV2 implements IMarcarCallbacksRecebidosV2 {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { ids: number[] }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>('/api/v2/callbacks/recebidos', {
      method: 'POST',
      body: { ids: input.ids },
    });
    if (result._tag === 'Left') return result;
    return right(undefined);
  }
}
