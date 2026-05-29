import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { IDownloadDocumento } from '../../ports/IDownloadDocumento.js';

/**
 * Operation para download de documento PDF da API Escavador V2.
 *
 * Usa IHttpClient.requestRaw() para obter binários sem parsing JSON.
 * Integra-se com sistema de autenticação do cliente HTTP.
 *
 * @implements {IDownloadDocumento}
 */
export class DownloadDocumento implements IDownloadDocumento {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { id: number }): Promise<Either<SourceError, ArrayBuffer>> {
    return this.http.requestRaw(`/api/v2/documentos/${input.id}/download`, {
      headers: { Accept: 'application/pdf' },
      timeoutMs: 60_000,
    });
  }
}
