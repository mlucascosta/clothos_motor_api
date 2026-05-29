import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ListarSistemasResponse } from '../dtos/v2/TribunalV2Dto.js';

export interface IListarSistemasTribunais {
  execute(): Promise<Either<SourceError, ListarSistemasResponse>>;
}
