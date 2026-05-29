/**
 * @fileoverview Port para operation RecallV2.
 * @module infrastructure/providers/apibrasil/ports/IRecallV2
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { RecallV2Dto } from '../dtos/RecallV2Dto.js';

export interface IRecallV2 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RecallV2Dto>>;
}
