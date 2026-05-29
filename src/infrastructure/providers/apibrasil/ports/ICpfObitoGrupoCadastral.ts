/**
 * @fileoverview Port para operation CpfObitoGrupoCadastral.
 * @module infrastructure/providers/apibrasil/ports/ICpfObitoGrupoCadastral
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CpfObitoGrupoCadastralDto } from '../dtos/CpfObitoGrupoCadastralDto.js';

export interface ICpfObitoGrupoCadastral {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CpfObitoGrupoCadastralDto>>;
}
