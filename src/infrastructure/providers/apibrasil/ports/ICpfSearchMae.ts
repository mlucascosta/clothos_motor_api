/**
 * @fileoverview Port para operation CpfSearchMae.
 * @module infrastructure/providers/apibrasil/ports/ICpfSearchMae
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CpfSearchMaeDto } from '../dtos/CpfSearchMaeDto.js';

export interface ICpfSearchMae {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CpfSearchMaeDto>>;
}
