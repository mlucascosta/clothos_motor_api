/**
 * @fileoverview Port para operation ProprietarioAtual.
 * @module infrastructure/providers/apibrasil/ports/IProprietarioAtual
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ProprietarioAtualDto } from '../dtos/ProprietarioAtualDto.js';

export interface IProprietarioAtual {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ProprietarioAtualDto>>;
}
