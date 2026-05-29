/**
 * @fileoverview Port para operation SituacaoEleitoral.
 * @module infrastructure/providers/apibrasil/ports/ISituacaoEleitoral
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { SituacaoEleitoralDto } from '../dtos/SituacaoEleitoralDto.js';

export interface ISituacaoEleitoral {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SituacaoEleitoralDto>>;
}
