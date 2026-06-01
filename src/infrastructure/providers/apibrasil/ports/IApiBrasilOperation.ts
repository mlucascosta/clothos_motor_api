/**
 * @fileoverview Port compartilhada para todas as operations do APIBrasil.
 * Usada pelo registry e pela rota como tipo genérico.
 * @module infrastructure/providers/apibrasil/ports/IApiBrasilOperation
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';

export interface IApiBrasilOperation<T = unknown> {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, T>>;
}
