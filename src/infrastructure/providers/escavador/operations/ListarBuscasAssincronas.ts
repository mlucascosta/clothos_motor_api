import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { ListarBuscasAssincronasResponse } from '../dtos/BuscaAssincronaDto.js';
import { ListarBuscasAssincronasResponseSchema } from '../dtos/BuscaAssincronaDto.js';

export interface IListarBuscasAssincronas {
  execute(input: { pagina?: number }): Promise<
    Either<SourceError, ListarBuscasAssincronasResponse>
  >;
}

export class ListarBuscasAssincronas implements IListarBuscasAssincronas {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<
    Either<SourceError, ListarBuscasAssincronasResponse>
  > {
    const result = await this.http.request<unknown>('/api/v1/async/resultados', {
      params: { page: input.pagina },
    });
    if (result._tag === 'Left') return result;
    const parsed = ListarBuscasAssincronasResponseSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
