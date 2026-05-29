/**
 * @fileoverview Port para operation EnriquecimentoDeLead.
 * @module infrastructure/providers/apibrasil/ports/IEnriquecimentoDeLead
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { EnriquecimentoDeLeadDto } from '../dtos/EnriquecimentoDeLeadDto.js';

export interface IEnriquecimentoDeLead {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, EnriquecimentoDeLeadDto>>;
}
