/**
 * @fileoverview Port para operation BaseNacionalOnline.
 * @module infrastructure/providers/apibrasil/ports/IBaseNacionalOnline
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { BaseNacionalOnlineDto } from '../dtos/BaseNacionalOnlineDto.js';

export interface IBaseNacionalOnline {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, BaseNacionalOnlineDto>>;
}
