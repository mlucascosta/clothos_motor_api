/**
 * @fileoverview Port para operation Gravame.
 * @module infrastructure/providers/apibrasil/ports/IGravame
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { GravameDto } from '../dtos/GravameDto.js';

export interface IGravame {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, GravameDto>>;
}
