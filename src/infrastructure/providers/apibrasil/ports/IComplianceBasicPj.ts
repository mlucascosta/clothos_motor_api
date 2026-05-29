/**
 * @fileoverview Port para operation ComplianceBasicPj.
 * @module infrastructure/providers/apibrasil/ports/IComplianceBasicPj
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ComplianceBasicPjDto } from '../dtos/ComplianceBasicPjDto.js';

export interface IComplianceBasicPj {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ComplianceBasicPjDto>>;
}
