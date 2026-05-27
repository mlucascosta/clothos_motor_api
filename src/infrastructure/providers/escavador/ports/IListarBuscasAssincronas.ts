// GET /api/v1/buscas-assincronas
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ListarBuscasAssincronasResponse } from '../dtos/BuscaAssincronaDto.js';

export interface ListarBuscasAssincronasInput {
  pagina?: number;
}

export interface IListarBuscasAssincronas {
  execute(input: ListarBuscasAssincronasInput): Promise<Either<SourceError, ListarBuscasAssincronasResponse>>;
}
