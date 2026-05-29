/**
 * @fileoverview Port para operation Recall.
 * @module infrastructure/providers/apibrasil/ports/IRecall
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { RecallDto } from '../dtos/RecallDto.js';

export interface IRecall {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RecallDto>>;
}
