/**
 * @fileoverview Port para operation GravameV2.
 * @module infrastructure/providers/apibrasil/ports/IGravameV2
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { GravameV2Dto } from '../dtos/GravameV2Dto.js';

export interface IGravameV2 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, GravameV2Dto>>;
}
