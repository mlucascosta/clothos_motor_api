/**
 * @fileoverview Port para operation CpfRelatorio.
 * @module infrastructure/providers/apibrasil/ports/ICpfRelatorio
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CpfRelatorioDto } from '../dtos/CpfRelatorioDto.js';

export interface ICpfRelatorio {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CpfRelatorioDto>>;
}
