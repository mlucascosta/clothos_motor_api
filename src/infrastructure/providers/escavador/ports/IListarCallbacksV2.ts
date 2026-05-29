import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ListarCallbacksV2Response } from '../dtos/v2/CallbackV2Dto.js';

export interface IListarCallbacksV2 {
  execute(input: { pagina?: number }): Promise<Either<SourceError, ListarCallbacksV2Response>>;
}
