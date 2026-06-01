/**
 * @fileoverview Port para operation Renajud.
 * @module infrastructure/providers/apibrasil/ports/IRenajud
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { RenajudDto } from '../dtos/RenajudDto.js';

export interface IRenajud {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, RenajudDto>>;
}
