/**
 * @fileoverview Port para operation DetalhamentoNegativo.
 * @module infrastructure/providers/apibrasil/ports/IDetalhamentoNegativo
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { DetalhamentoNegativoDto } from '../dtos/DetalhamentoNegativoDto.js';

export interface IDetalhamentoNegativo {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, DetalhamentoNegativoDto>>;
}
