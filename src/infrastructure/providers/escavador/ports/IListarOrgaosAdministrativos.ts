// GET /api/v1/orgaos-administrativos
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ListarOrgaosResponse } from '../dtos/TribunalDto.js';

export interface ListarOrgaosAdministrativosInput {
  pagina?: number;
}

export interface IListarOrgaosAdministrativos {
  execute(
    input: ListarOrgaosAdministrativosInput,
  ): Promise<Either<SourceError, ListarOrgaosResponse>>;
}
