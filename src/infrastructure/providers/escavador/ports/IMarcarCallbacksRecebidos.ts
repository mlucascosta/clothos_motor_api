// POST /api/v1/callback/recebidos
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { MarcarCallbacksRecebidosInput } from '../dtos/CallbackDto.js';

export type { MarcarCallbacksRecebidosInput };

export interface IMarcarCallbacksRecebidos {
  execute(input: MarcarCallbacksRecebidosInput): Promise<Either<SourceError, void>>;
}
