/**
 * @fileoverview Port para operation RelatorioPositivo.
 * @module infrastructure/providers/apibrasil/ports/IRelatorioPositivo
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { RelatorioPositivoDto } from '../dtos/RelatorioPositivoDto.js';

export interface IRelatorioPositivo {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RelatorioPositivoDto>>;
}
