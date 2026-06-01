/**
 * @fileoverview Port para operation DebitosV4.
 * @module infrastructure/providers/apibrasil/ports/IDebitosV4
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DebitosV4Dto } from '../dtos/DebitosV4Dto.js';

export interface IDebitosV4 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, DebitosV4Dto>>;
}
