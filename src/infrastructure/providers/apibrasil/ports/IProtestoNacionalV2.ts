/**
 * @fileoverview Port para operation ProtestoNacionalV2.
 * @module infrastructure/providers/apibrasil/ports/IProtestoNacionalV2
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ProtestoNacionalV2Dto } from '../dtos/ProtestoNacionalV2Dto.js';

export interface IProtestoNacionalV2 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ProtestoNacionalV2Dto>>;
}
