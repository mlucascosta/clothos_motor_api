import { type Either, isLeft, right } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { IRemoverCertificado } from '../../ports/IRemoverCertificado.js';

export class RemoverCertificado implements IRemoverCertificado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>(`/api/v2/certificados/${input.id}`, {
      method: 'DELETE',
    });
    if (isLeft(result)) return result;
    return right(undefined);
  }
}
