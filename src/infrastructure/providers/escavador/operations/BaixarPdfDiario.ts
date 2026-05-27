import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';

export interface IBaixarPdfDiario {
  execute(input: { id: number }): Promise<Either<SourceError, Buffer>>;
}

export class BaixarPdfDiario implements IBaixarPdfDiario {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string,
  ) {}

  async execute(input: { id: number }): Promise<Either<SourceError, Buffer>> {
    try {
      const url = `${this.baseUrl}/api/v1/diarios-oficiais/${input.id}/pdf`;
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${this.apiKey}` } });
      if (!resp.ok)
        return left(new SourceError('UPSTREAM_ERROR', 'escavador', `HTTP ${resp.status}`));
      const buffer = Buffer.from(await resp.arrayBuffer());
      return right(buffer);
    } catch (err) {
      return left(new SourceError('UPSTREAM_ERROR', 'escavador', err));
    }
  }
}
