import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { CallbackV2Dto } from '../dtos/v2/CallbackV2Dto.js';

export interface IReenviarCallbackV2 {
  execute(input: { id: number }): Promise<Either<SourceError, CallbackV2Dto>>;
}
