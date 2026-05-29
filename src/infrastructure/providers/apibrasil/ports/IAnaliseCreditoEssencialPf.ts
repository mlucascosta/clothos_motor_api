/**
 * @fileoverview Port para operation AnaliseCreditoEssencialPf.
 * @module infrastructure/providers/apibrasil/ports/IAnaliseCreditoEssencialPf
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { AnaliseCreditoEssencialPfDto } from '../dtos/AnaliseCreditoEssencialPfDto.js';

export interface IAnaliseCreditoEssencialPf {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, AnaliseCreditoEssencialPfDto>>;
}
