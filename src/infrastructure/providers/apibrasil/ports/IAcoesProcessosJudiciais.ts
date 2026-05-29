/**
 * @fileoverview Port para operation AcoesProcessosJudiciais.
 * @module infrastructure/providers/apibrasil/ports/IAcoesProcessosJudiciais
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { AcoesProcessosJudiciaisDto } from '../dtos/AcoesProcessosJudiciaisDto.js';

export interface IAcoesProcessosJudiciais {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AcoesProcessosJudiciaisDto>>;
}
