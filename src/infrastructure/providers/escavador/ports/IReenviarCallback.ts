// POST /api/v1/callback/reenviar
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { CallbackDto, ReenviarCallbackInput } from '../dtos/CallbackDto.js';

export type { ReenviarCallbackInput };

export interface IReenviarCallback {
  execute(input: ReenviarCallbackInput): Promise<Either<SourceError, CallbackDto>>;
}
