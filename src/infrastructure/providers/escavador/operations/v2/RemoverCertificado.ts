import { type Either, right } from '../../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';

export interface IRemoverCertificado {
  execute(input: { id: number }): Promise<Either<SourceError, void>>;
}

export class RemoverCertificado implements IRemoverCertificado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>(`/api/v2/certificados/${input.id}`, {
      method: 'DELETE',
    });
    if (result._tag === 'Left') return result;
    return right(undefined);
  }
}
