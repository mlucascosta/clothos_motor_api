import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CvmCorretoraDto } from '../dtos/CvmCorretoraDto.js';

export interface ICvmCorretora {
  readonly path: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CvmCorretoraDto>>;
}
