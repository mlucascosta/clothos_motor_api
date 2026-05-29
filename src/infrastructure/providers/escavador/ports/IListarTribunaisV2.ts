import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { ListarTribunaisV2Response } from '../dtos/v2/TribunalV2Dto.js';

export interface IListarTribunaisV2 {
  execute(input: { sistema_id?: number }): Promise<Either<SourceError, ListarTribunaisV2Response>>;
}
