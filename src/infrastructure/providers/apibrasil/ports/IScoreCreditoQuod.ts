/**
 * @fileoverview Port para operation ScoreCreditoQuod.
 * @module infrastructure/providers/apibrasil/ports/IScoreCreditoQuod
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ScoreCreditoQuodDto } from '../dtos/ScoreCreditoQuodDto.js';

export interface IScoreCreditoQuod {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ScoreCreditoQuodDto>>;
}
