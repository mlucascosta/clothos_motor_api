/**
 * @fileoverview Port para operation BaseNacionalV2.
 * @module infrastructure/providers/apibrasil/ports/IBaseNacionalV2
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { BaseNacionalV2Dto } from '../dtos/BaseNacionalV2Dto.js';

export interface IBaseNacionalV2 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, BaseNacionalV2Dto>>;
}
