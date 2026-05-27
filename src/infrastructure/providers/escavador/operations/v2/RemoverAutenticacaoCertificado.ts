import { type Either, right } from '../../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../../shared/infrastructure/IHttpClient.js';

export interface IRemoverAutenticacaoCertificado {
  execute(input: { id: number; autenticacaoId: number }): Promise<Either<SourceError, void>>;
}

export class RemoverAutenticacaoCertificado implements IRemoverAutenticacaoCertificado {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number; autenticacaoId: number }): Promise<Either<SourceError, void>> {
    const result = await this.http.request<unknown>(
      `/api/v2/certificados/${input.id}/autenticacoes/${input.autenticacaoId}`,
      { method: 'DELETE' },
    );
    if (result._tag === 'Left') return result;
    return right(undefined);
  }
}
