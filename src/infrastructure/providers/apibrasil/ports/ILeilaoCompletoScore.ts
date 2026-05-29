/**
 * @fileoverview Port para operation LeilaoCompletoScore.
 * @module infrastructure/providers/apibrasil/ports/ILeilaoCompletoScore
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { LeilaoCompletoScoreDto } from '../dtos/LeilaoCompletoScoreDto.js';

export interface ILeilaoCompletoScore {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, LeilaoCompletoScoreDto>>;
}
