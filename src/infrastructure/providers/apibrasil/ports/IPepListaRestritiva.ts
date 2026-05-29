/**
 * @fileoverview Port para operation PepListaRestritiva.
 * @module infrastructure/providers/apibrasil/ports/IPepListaRestritiva
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { PepListaRestritivaDto } from '../dtos/PepListaRestritivaDto.js';

export interface IPepListaRestritiva {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PepListaRestritivaDto>>;
}
