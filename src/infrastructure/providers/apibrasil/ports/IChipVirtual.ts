/**
 * @fileoverview Port para operation ChipVirtual.
 * @module infrastructure/providers/apibrasil/ports/IChipVirtual
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ChipVirtualDto } from '../dtos/ChipVirtualDto.js';

export interface IChipVirtual {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ChipVirtualDto>>;
}
