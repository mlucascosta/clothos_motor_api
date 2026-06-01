/**
 * @fileoverview Port para operation HistoricoKm.
 * @module infrastructure/providers/apibrasil/ports/IHistoricoKm
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { HistoricoKmDto } from '../dtos/HistoricoKmDto.js';

export interface IHistoricoKm {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, HistoricoKmDto>>;
}
