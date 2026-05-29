/**
 * @fileoverview Port para operation ProprietarioAtualV2.
 * @module infrastructure/providers/apibrasil/ports/IProprietarioAtualV2
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ProprietarioAtualV2Dto } from '../dtos/ProprietarioAtualV2Dto.js';

export interface IProprietarioAtualV2 {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ProprietarioAtualV2Dto>>;
}
