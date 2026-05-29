/**
 * @fileoverview Port para operation Farol.
 * @module infrastructure/providers/apibrasil/ports/IFarol
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { FarolDto } from '../dtos/FarolDto.js';

export interface IFarol {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, FarolDto>>;
}
