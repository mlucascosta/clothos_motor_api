/**
 * @fileoverview Port para operation ComplianceCompletePj.
 * @module infrastructure/providers/apibrasil/ports/IComplianceCompletePj
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { ComplianceCompletePjDto } from '../dtos/ComplianceCompletePjDto.js';

export interface IComplianceCompletePj {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, ComplianceCompletePjDto>>;
}
