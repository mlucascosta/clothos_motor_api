/**
 * @fileoverview Port para operation Fipe.
 * @module infrastructure/providers/apibrasil/ports/IFipe
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { FipeDto } from '../dtos/FipeDto.js';

export interface IFipe {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, FipeDto>>;
}
