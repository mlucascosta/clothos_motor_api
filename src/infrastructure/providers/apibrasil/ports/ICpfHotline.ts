/**
 * @fileoverview Port para operation CpfHotline.
 * @module infrastructure/providers/apibrasil/ports/ICpfHotline
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CpfHotlineDto } from '../dtos/CpfHotlineDto.js';

export interface ICpfHotline {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, CpfHotlineDto>>;
}
