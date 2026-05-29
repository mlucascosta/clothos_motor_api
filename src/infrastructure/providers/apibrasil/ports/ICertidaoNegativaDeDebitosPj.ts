/**
 * @fileoverview Port para operation CertidaoNegativaDeDebitosPj.
 * @module infrastructure/providers/apibrasil/ports/ICertidaoNegativaDeDebitosPj
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CertidaoNegativaDeDebitosPjDto } from '../dtos/CertidaoNegativaDeDebitosPjDto.js';

export interface ICertidaoNegativaDeDebitosPj {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CertidaoNegativaDeDebitosPjDto>>;
}
