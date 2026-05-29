import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CnpjDto } from '../dtos/CnpjDto.js';

export interface ICnpj {
  readonly path: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, CnpjDto>>;
}
