import { left, right, type Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IBuscarGeral, BuscarGeralInput } from '../ports/IBuscarGeral.js';
import { BuscaGeralResponseSchema, type BuscaGeralResponse } from '../dtos/BuscaGeralDto.js';

export class BuscarGeral implements IBuscarGeral {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: BuscarGeralInput): Promise<Either<SourceError, BuscaGeralResponse>> {
    const result = await this.http.request<unknown>('/api/v1/busca', {
      params: {
        q: input.query,
        tipo: input.tipo,
        page: input.pagina,
      },
    });

    if (result._tag === 'Left') return result;

    const parsed = BuscaGeralResponseSchema.safeParse(result.value);
    if (!parsed.success) {
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    }

    return right(parsed.data);
  }
}
