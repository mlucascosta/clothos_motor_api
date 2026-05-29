/**
 * @fileoverview Port para operation BetSafeCompliance.
 * @module infrastructure/providers/apibrasil/ports/IBetSafeCompliance
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { BetSafeComplianceDto } from '../dtos/BetSafeComplianceDto.js';

export interface IBetSafeCompliance {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, BetSafeComplianceDto>>;
}
