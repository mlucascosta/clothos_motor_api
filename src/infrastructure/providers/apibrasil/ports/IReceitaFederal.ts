/**
 * @fileoverview Port para operation ReceitaFederal.
 * @module infrastructure/providers/apibrasil/ports/IReceitaFederal
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ReceitaFederalDto } from '../dtos/ReceitaFederalDto.js';

export interface IReceitaFederal {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ReceitaFederalDto>>;
}
