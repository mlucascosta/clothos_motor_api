/**
 * @fileoverview Port para operation CpfLite.
 * @module infrastructure/providers/apibrasil/ports/ICpfLite
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CpfLiteDto } from '../dtos/CpfLiteDto.js';

export interface ICpfLite {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, CpfLiteDto>>;
}
