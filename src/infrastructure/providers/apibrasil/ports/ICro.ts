/**
 * @fileoverview Port para operation Cro.
 * @module infrastructure/providers/apibrasil/ports/ICro
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CroDto } from '../dtos/CroDto.js';

export interface ICro {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CroDto>>;
}
