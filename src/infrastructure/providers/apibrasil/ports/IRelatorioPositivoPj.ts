/**
 * @fileoverview Port para operation RelatorioPositivoPj.
 * @module infrastructure/providers/apibrasil/ports/IRelatorioPositivoPj
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { RelatorioPositivoPjDto } from '../dtos/RelatorioPositivoPjDto.js';

export interface IRelatorioPositivoPj {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RelatorioPositivoPjDto>>;
}
