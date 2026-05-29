/**
 * @fileoverview Port para operation ProtestosNacionalBase.
 * @module infrastructure/providers/apibrasil/ports/IProtestosNacionalBase
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ProtestosNacionalBaseDto } from '../dtos/ProtestosNacionalBaseDto.js';

export interface IProtestosNacionalBase {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ProtestosNacionalBaseDto>>;
}
