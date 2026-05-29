import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import type { ListarBuscasAssincronasResponse } from '../dtos/BuscaAssincronaDto.js';
import { ListarBuscasAssincronasResponseSchema } from '../dtos/BuscaAssincronaDto.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import type { IListarBuscasAssincronas } from '../ports/IListarBuscasAssincronas.js';

export class ListarBuscasAssincronas implements IListarBuscasAssincronas {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<
    Either<SourceError, ListarBuscasAssincronasResponse>
  > {
    const result = await this.http.request<unknown>('/api/v1/async/resultados', {
      params: { page: input.pagina },
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarBuscasAssincronasResponseSchema, result.value, 'escavador');
  }
}
