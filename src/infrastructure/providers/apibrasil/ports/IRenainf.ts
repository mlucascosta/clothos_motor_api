/**
 * @fileoverview Port para operation Renainf.
 * @module infrastructure/providers/apibrasil/ports/IRenainf
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { RenainfDto } from '../dtos/RenainfDto.js';

export interface IRenainf {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, RenainfDto>>;
}
