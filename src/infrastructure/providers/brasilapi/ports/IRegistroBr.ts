import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { RegistroBrDto } from '../dtos/RegistroBrDto.js';

export interface IRegistroBr {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, RegistroBrDto>>;
}
