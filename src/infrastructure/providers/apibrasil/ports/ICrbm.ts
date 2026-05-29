/**
 * @fileoverview Port para operation Crbm.
 * @module infrastructure/providers/apibrasil/ports/ICrbm
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CrbmDto } from '../dtos/CrbmDto.js';

export interface ICrbm {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CrbmDto>>;
}
