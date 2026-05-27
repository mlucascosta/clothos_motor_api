import { left, right, type Either } from '../../../../../shared/domain/Either.js';
import { SourceError } from '../../../../../shared/domain/errors/SourceError.js';

export interface IDownloadDocumento {
  execute(input: { id: number }): Promise<Either<SourceError, Buffer>>;
}

export class DownloadDocumento implements IDownloadDocumento {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string,
  ) {}

  async execute(input: { id: number }): Promise<Either<SourceError, Buffer>> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/api/v2/documentos/${input.id}/download`;
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${this.apiKey}`, Accept: 'application/pdf' },
        signal: AbortSignal.timeout(60_000),
      });
      if (response.status === 401 || response.status === 403) {
        return left(new SourceError('AUTH_FAILED', 'escavador-v2', `HTTP ${response.status}`));
      }
      if (response.status === 404) return left(new SourceError('NOT_FOUND', 'escavador-v2'));
      if (!response.ok) return left(new SourceError('UPSTREAM_ERROR', 'escavador-v2', `HTTP ${response.status}`));
      const bytes = await response.arrayBuffer();
      return right(Buffer.from(bytes));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'TimeoutError') {
        return left(new SourceError('TIMEOUT', 'escavador-v2'));
      }
      return left(new SourceError('UPSTREAM_ERROR', 'escavador-v2', err));
    }
  }
}
