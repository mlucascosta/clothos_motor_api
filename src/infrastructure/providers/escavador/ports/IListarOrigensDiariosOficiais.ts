// GET /api/v1/diarios-oficiais/origens
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ListarOrigensDiariosResponse } from '../dtos/DiarioOficialDto.js';

export interface ListarOrigensDiariosOficiaisInput {
  estado?: string;
}

export interface IListarOrigensDiariosOficiais {
  execute(
    input: ListarOrigensDiariosOficiaisInput,
  ): Promise<Either<SourceError, ListarOrigensDiariosResponse>>;
}
