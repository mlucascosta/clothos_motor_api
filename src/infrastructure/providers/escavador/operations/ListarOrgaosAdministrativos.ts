import { type Either, left, right } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { ListarOrgaosResponse } from '../dtos/TribunalDto.js';
import { ListarOrgaosResponseSchema } from '../dtos/TribunalDto.js';

export interface IListarOrgaosAdministrativos {
  execute(input: { pagina?: number }): Promise<Either<SourceError, ListarOrgaosResponse>>;
}

export class ListarOrgaosAdministrativos implements IListarOrgaosAdministrativos {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<Either<SourceError, ListarOrgaosResponse>> {
    const result = await this.http.request<unknown>('/api/v1/orgaos-administrativos', {
      params: { page: input.pagina },
    });
    if (result._tag === 'Left') return result;
    const parsed = ListarOrgaosResponseSchema.safeParse(result.value);
    if (!parsed.success)
      return left(new SourceError('SCHEMA_MISMATCH', 'escavador', parsed.error.message));
    return right(parsed.data);
  }
}
