/**
 * @fileoverview Port para operation Var.
 * @module infrastructure/providers/apibrasil/ports/IVar
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { VarDto } from '../dtos/VarDto.js';

export interface IVar {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, VarDto>>;
}
