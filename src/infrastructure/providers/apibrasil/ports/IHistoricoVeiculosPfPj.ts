/**
 * @fileoverview Port para operation HistoricoVeiculosPfPj.
 * @module infrastructure/providers/apibrasil/ports/IHistoricoVeiculosPfPj
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { HistoricoVeiculosPfPjDto } from '../dtos/HistoricoVeiculosPfPjDto.js';

export interface IHistoricoVeiculosPfPj {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, HistoricoVeiculosPfPjDto>>;
}
