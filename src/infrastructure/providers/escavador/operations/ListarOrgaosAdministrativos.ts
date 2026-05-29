import { isLeft } from '../../../../shared/domain/Either.js';
import type { Either } from '../../../../shared/domain/Either.js';
import { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { ListarOrgaosResponse } from '../dtos/TribunalDto.js';
import { ListarOrgaosResponseSchema } from '../dtos/TribunalDto.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import type { IListarOrgaosAdministrativos } from '../ports/IListarOrgaosAdministrativos.js';

export class ListarOrgaosAdministrativos implements IListarOrgaosAdministrativos {
  constructor(private readonly http: IHttpClient) {}

  async execute(input: { pagina?: number }): Promise<Either<SourceError, ListarOrgaosResponse>> {
    const result = await this.http.request<unknown>('/api/v1/orgao-administrativo/origens', {
      params: { page: input.pagina },
    });
    if (isLeft(result)) return result;
    return parseOrSchemaError(ListarOrgaosResponseSchema, result.value, 'escavador');
  }
}
